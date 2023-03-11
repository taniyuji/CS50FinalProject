import { groundCenterXPos, groundBottomYPos, groundTopYPos, wallLeftXPos, wallRightXPos } from "./stageSetter.js";
import { JudgeIsHitEnemy, JudgeIsHitBullet, playerLeftXPos, playerRightXPos, playerFootYPos, playerHeadYPos, PlayerVerticalStates, playerVerticalState } from "./playerMover.js";

var enemyImage = document.getElementById("EnemyRightImage");
const bulletImage = document.getElementById("BulletImage");
const canvas = document.getElementById("maincanvas");
const ctx = canvas.getContext("2d");

var width = 60;
var height = 30;
var x = 0;
var y = groundBottomYPos - height;
var xWalkDestination = 0;
var walkSpeed = 3;
var jumpSpeed = 3;
var jumpHeightLimit = groundTopYPos;
var enemyLeftXPos = x;
var enemyRightXPos = x + width;
var enemyHeadYPos = y;
var enemyFootYPos = y + height;

var bulletWidth = 30;
var bulletHeight = 10;
var bulletSpeed = 7;
var shootInterval = 100;
var intervalCounter = 0;
var shootXPos = x + width;
var shootYPos = y + height / 2;
var bulletXPos = shootXPos;
var isShootingBullet = false;

var EnemyStates = {
    isIdle: 0,
    isJumping: 1,
    isFloating: 2,
    isDefeated: 3,
    isWalkingRight: 4,
    isWalkingLeft: 5,
}
var enemyState = EnemyStates.isIdle;
var enemyLookDirection = EnemyStates.isWalkingRight;

var levelupSpeed = 1;
export var defeatedTime = 0;

export function MoveEnemy() {
    //console.log(PlayerLeftPos);

    UpdateData();
    SetWalk();
    WalkToDestination();

    if (enemyState == EnemyStates.isWalkingRight ||
        enemyState == EnemyStates.isWalkingLeft) {
        JudgeIsHitEnemy(enemyLeftXPos, enemyRightXPos, enemyHeadYPos, enemyFootYPos);
        JudgeIsDefeated();
        ctx.drawImage(enemyImage, x, y, width, height);
        return;
    }

    BulletBehavior();

    if (enemyState == EnemyStates.isDefeated)
    {
        DefeatedBehavior();
        return;
    }

    JudgeCanShoot();
    JudgeRandomJump();
    JumpBehavior();
    FloatingBehavior();
    JudgeIsHitEnemy(enemyLeftXPos, enemyRightXPos, enemyHeadYPos, enemyFootYPos);
    JudgeIsDefeated();

    ctx.drawImage(enemyImage, x, y, width, height);
}

function UpdateData() {
    enemyLeftXPos = x;
    enemyRightXPos = x + width;
    enemyHeadYPos = y;
    enemyFootYPos = y + height;
    walkSpeed = 3 * levelupSpeed;
    jumpSpeed = 3 * levelupSpeed;
}

function SetWalk() {
    if (xWalkDestination != 0) return;

    xWalkDestination = GetRandomNumber(wallLeftXPos, wallRightXPos);

    enemyState = xWalkDestination > groundCenterXPos ?
        EnemyStates.isWalkingLeft : EnemyStates.isWalkingRight;

    enemyLookDirection = enemyState;

    x = enemyState == EnemyStates.isWalkingLeft ?
        wallRightXPos : wallLeftXPos - width;
    
    y = groundBottomYPos - height;

    if (enemyState == EnemyStates.isWalkingLeft)
        enemyImage = document.getElementById("EnemyLeftImage");
    else
        enemyImage = document.getElementById("EnemyRightImage");
}

function WalkToDestination() {
    if (enemyState != EnemyStates.isWalkingRight
        && enemyState != EnemyStates.isWalkingLeft) return;

    if (enemyState == EnemyStates.isWalkingRight) {
        if (x < xWalkDestination)
            x += walkSpeed;
        else
            enemyState = EnemyStates.isIdle;
    } else {
        if (x + width > xWalkDestination)
            x -= walkSpeed;
        else
            enemyState = EnemyStates.isIdle;
    }

    console.log("destination:" + xWalkDestination + "state = " + enemyState + "now = " + x);
}

function DefeatedBehavior()
{
    xWalkDestination = 0;
    enemyState == EnemyStates.isIdle;
    levelupSpeed += 0.1;
    defeatedTime++;
    isShootingBullet = false;
}

function JudgeIsDefeated() {
    if (playerVerticalState != PlayerVerticalStates.Floating)
        return;

    if ((x < playerLeftXPos && x + width > playerLeftXPos)
        && playerFootYPos > y)
        enemyState = EnemyStates.isDefeated;
    else if ((playerRightXPos > x && x + width > playerRightXPos)
        && playerFootYPos > y)
        enemyState = EnemyStates.isDefeated;
}

function JudgeCanShoot() {
    if (isShootingBullet) return;

    if (intervalCounter < shootInterval) {
        intervalCounter++;
        return;
    }

    intervalCounter = 0;
    shootXPos = enemyLookDirection == EnemyStates.isWalkingLeft ?
        x : x + width;
    bulletXPos = shootXPos;
    shootYPos = y + height / 2;
    isShootingBullet = true;
}

function BulletBehavior() {
    if (!isShootingBullet) return;

    bulletXPos = enemyLookDirection == EnemyStates.isWalkingLeft ?
        bulletXPos - bulletSpeed : bulletXPos + bulletSpeed;

    ctx.drawImage(bulletImage, bulletXPos, shootYPos, bulletWidth, bulletHeight)

    var bulletLeft = bulletXPos;
    var bulletRight = bulletXPos + bulletWidth;
    var bulletBottom = shootYPos + bulletHeight / 2;
    var bulletTop = shootYPos - bulletHeight / 2;

    if (JudgeIsHitBullet(bulletRight, bulletLeft, bulletBottom, bulletTop))
        isShootingBullet = false;
    else if (JudgeIsBulletOutOfCanvas())
        isShootingBullet = false;
}

function JudgeIsBulletOutOfCanvas() {
    if (bulletXPos + bulletWidth < wallRightXPos)
        return false;

    return true;
}

function JudgeRandomJump() {
    if (enemyState != EnemyStates.isIdle) return;

    var num = GetRandomNumber(0, 150);

    if (num == 1) {
        enemyState = EnemyStates.isJumping = true;
        console.log("goJump");
    }
}

function GetRandomNumber(min, max) {
    return Math.floor(Math.random() * (max + 1 - min) + min);
}

function JumpBehavior() {
    if (enemyState != EnemyStates.isJumping) return;

    if (y > jumpHeightLimit)
        y -= jumpSpeed;
    else
        enemyState = EnemyStates.isFloating;
}

function FloatingBehavior() {
    if (enemyState != EnemyStates.isFloating) return;

    if (y + height < groundBottomYPos)
        y += jumpSpeed;
    else {
        y = groundBottomYPos - height;
        enemyState = EnemyStates.isIdle;
    }
}


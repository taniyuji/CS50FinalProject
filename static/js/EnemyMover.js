import { groundBottomYPos, groundTopYPos, wallLeftXPos, wallRightXPos } from "./stageSetter.js";
import {JudgeIsHitBullet, playerLeftPos, playerRightPos, playerFootPos, playerHeadPos, PlayerVerticalStates, playerVerticalState} from "./playerMover.js";

const enemyImage = document.getElementById("EnemyImage");
const bulletImage = document.getElementById("BulletImage");
const canvas = document.getElementById("maincanvas");
const ctx = canvas.getContext("2d");

var width = 60;
var height = 30;
var x = 200;
var y = groundBottomYPos - height;
var isDefeated = false;

var bulletWidth = 30;
var bulletHeight = 10;
var bulletSpeed = 7;
var shootInterval = 100;
var intervalCounter = 0;
var shootXPos = x + width;
var shootYPos = y + height / 2;
var bulletXPos = shootXPos;
var isShootingBullet = false;

export default function MoveEnemy() {
    //console.log(PlayerLeftPos);

    if (isShootingBullet) {
        bulletXPos += bulletSpeed;
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

    if (isDefeated) return;

    if (!isShootingBullet) JudgeCanShoot();

    isDefeated = JudgeIsDefeated();

    ctx.drawImage(enemyImage, x, y, width, height);
}

function JudgeIsDefeated() {
    if (playerVerticalState != PlayerVerticalStates.Floating)
        return false;

    if ((x < playerLeftPos && x + width > playerLeftPos)
        && playerFootPos > y)
        return true;
    else if ((playerRightPos > x && x + width > playerRightPos)
        && playerFootPos > y)
        return true;

    return false;
}

function JudgeCanShoot() {
    if (intervalCounter < shootInterval) {
        intervalCounter++;
        return;
    }

    intervalCounter = 0;
    bulletXPos = shootXPos;
    isShootingBullet = true;
}

function JudgeIsBulletOutOfCanvas() {
    if (bulletXPos + bulletWidth < wallRightXPos)
        return false;

    return true;
}



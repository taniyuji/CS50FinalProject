import { groundBottomYPos, groundCenterXPos, groundTopYPos, wallLeftXPos, wallRightXPos } from "./stageSetter.js";
import getKeyState, { keys } from "./getInput.js";
import { DecreaseLife, playerLife } from "./HPController.js";

const canvas = document.getElementById("maincanvas");
const image1 = document.getElementById("playerImage1");
const image2 = document.getElementById("playerImage2");
const ctx = canvas.getContext("2d");

var playerWidth = 60;
var playerHeight = 15;
var addWidth = 10;
var addHeight = 10;
var jumpLimit = 50;
var jumpAmount = 0;
var moveSpeed = 8;
var jumpSpeed = -4;
var gravity = 3;
var climbingSpeed = 2;
var onGroundYPos = groundBottomYPos - playerHeight;
var onSealingPos = groundTopYPos;
var leftMoveLimitPos = wallLeftXPos;
var rightMoveLimitPos = wallRightXPos - playerWidth;

export var playerRightXPos = x + playerWidth;
export var playerLeftXPos = x;
export var playerFootYPos = y + playerHeight;
export var playerHeadYPos = y;

var PlayerHorizontalStates = {
    Idle: 1,
    MovingLeft: 2,
    MovingRight: 3,
    LeftWallJumping: 4,
    RightWallJumping: 5,
    ShootingStar: 6,
}
var playerHorizontalState = PlayerHorizontalStates.Idle;

export var PlayerVerticalStates = {
    OnGround: 1,
    Jumping: 2,
    Floating: 3,
    ClimbingLeft: 4,
    ClimbingRight: 5,
    OnSealing: 6,
}
export var playerVerticalState = PlayerVerticalStates.OnGround;

var PlayerBodyStates = {
    isDamaged: 0,
    isInvincible: 1,
    isNormal: 2,
}
var playerBodyState = PlayerBodyStates.isNormal;

var x = groundCenterXPos;
var y = groundBottomYPos - playerHeight;

var invincibleTime = 70;
var invincibleTimeCounter = 0;

var isSetImage = true;

export default function movePlayer() {

    JudgeIdleAndFloatingState();
    JudgeRightAllowState();
    JudgeLeftAllowState();
    JudgeUpArrowState();
    JudgeSpaceState();

    OnGroundBehavior();
    RunBehavior();
    ClimbingBehavior();
    OnSealingBehavior();
    JumpingBehaviorAndJudgeFloatingState();
    FloatingBehaviorAndJudgeOnGroundState();

    UpdateExportData();

    var image = SetImage();
    var width = playerWidth;
    var height = playerHeight;

    if (image == image2) {
        width += addWidth
        height += addHeight;
    }

    DamagedBehavior();
    InvincibleBehavior();

    if (isSetImage) ctx.drawImage(image, x, y, width, height);
}

function UpdateExportData() {
    playerRightXPos = x + playerWidth;
    playerLeftXPos = x;
    playerFootYPos = y + playerHeight;
    playerHeadYPos = y;
}

function JudgeIdleAndFloatingState() {
    if (getKeyState(keys.upAllow)) return;

    if (!judgeIsOnGround()
        && (playerVerticalState == PlayerVerticalStates.ClimbingLeft
            || playerVerticalState == PlayerVerticalStates.ClimbingRight
            || playerVerticalState == PlayerVerticalStates.OnSealing))
        playerVerticalState = PlayerVerticalStates.Floating;

    playerHorizontalState = PlayerHorizontalStates.Idle;
}

function JudgeRightAllowState() {
    if (!getKeyState(keys.rightAllow)) return;
    if (playerVerticalState == PlayerVerticalStates.ClimbingLeft) return;
    if (playerHorizontalState == PlayerHorizontalStates.LeftWallJumping) return;
    if (playerHorizontalState == PlayerHorizontalStates.RightWallJumping) return;
    if (playerHorizontalState == PlayerHorizontalStates.ShootingStar) return;

    playerHorizontalState = PlayerHorizontalStates.MovingRight;
}

function JudgeLeftAllowState() {
    if (!getKeyState(keys.leftAllow)) return;
    if (playerVerticalState == PlayerVerticalStates.ClimbingRight) return;
    if (playerHorizontalState == PlayerHorizontalStates.LeftWallJumping) return;
    if (playerHorizontalState == PlayerHorizontalStates.RightWallJumping) return;
    if (playerHorizontalState == PlayerHorizontalStates.ShootingStar) return;

    playerHorizontalState = PlayerHorizontalStates.MovingLeft;
}

function JudgeSpaceState() {
    if (!getKeyState(keys.space)) return;
    if (playerVerticalState == PlayerVerticalStates.Jumping) return;
    if (playerVerticalState == PlayerVerticalStates.Floating) return;

    if (playerVerticalState == PlayerVerticalStates.ClimbingLeft)
        playerHorizontalState = PlayerHorizontalStates.LeftWallJumping;
    else if (playerVerticalState == PlayerVerticalStates.ClimbingRight)
        playerHorizontalState = PlayerHorizontalStates.RightWallJumping;
    else if (playerVerticalState == PlayerVerticalStates.OnSealing) {
        playerHorizontalState = PlayerHorizontalStates.ShootingStar;
    }

    playerVerticalState = PlayerVerticalStates.Jumping;
}

function JudgeUpArrowState() {
    if (!getKeyState(keys.upAllow)) return;
    if (playerVerticalState == PlayerVerticalStates.Jumping) return;
    if (playerVerticalState == PlayerVerticalStates.Floating) return;
    if (playerHorizontalState == PlayerHorizontalStates.LeftWallJumping) return;
    if (playerHorizontalState == PlayerHorizontalStates.RightWallJumping) return;
    if (playerHorizontalState == PlayerHorizontalStates.ShootingStar) return;

    if (JudgeIsOnSealing())
        playerVerticalState = PlayerVerticalStates.OnSealing;
    else if (judgeIsRightMoveLimit())
        playerVerticalState = PlayerVerticalStates.ClimbingRight;
    else if (judgeIsLeftMoveLimit())
        playerVerticalState = PlayerVerticalStates.ClimbingLeft;
}

function OnGroundBehavior() {
    if (playerVerticalState != PlayerVerticalStates.OnGround) return;
    if (playerVerticalState == PlayerVerticalStates.ClimbingLeft) return;
    if (playerVerticalState == PlayerVerticalStates.ClimbingRight) return;

    y = onGroundYPos;
    jumpAmount = 0;
}

function RunBehavior() {
    if (playerHorizontalState != PlayerHorizontalStates.MovingLeft
        && playerHorizontalState != PlayerHorizontalStates.MovingRight) return;

    if (playerHorizontalState == PlayerHorizontalStates.MovingRight) {
        x = judgeIsRightMoveLimit() ?
            rightMoveLimitPos : x + moveSpeed;
    } else {
        x = judgeIsLeftMoveLimit() ?
            leftMoveLimitPos : x - moveSpeed;
    }
}

function ClimbingBehavior() {
    if (playerVerticalState != PlayerVerticalStates.ClimbingRight
        && playerVerticalState != PlayerVerticalStates.ClimbingLeft) return;

    y = JudgeIsOnSealing() ?
        onSealingPos : y - climbingSpeed;
}

function OnSealingBehavior() {
    if (playerVerticalState != PlayerVerticalStates.OnSealing) return;

    if (getKeyState(keys.rightAllow)) {
        x = judgeIsRightMoveLimit() ?
            rightMoveLimitPos : x + moveSpeed;
    } else if (getKeyState(keys.leftAllow)) {
        x = judgeIsLeftMoveLimit() ?
            leftMoveLimitPos : x - moveSpeed;
    }

    y = onSealingPos;
}

function JumpingBehaviorAndJudgeFloatingState() {
    if (playerVerticalState != PlayerVerticalStates.Jumping) return;

    if (jumpAmount < jumpLimit
        && playerHorizontalState != PlayerHorizontalStates.ShootingStar) {
        y += jumpSpeed;
        jumpAmount += -jumpSpeed;

        if (playerHorizontalState == PlayerHorizontalStates.LeftWallJumping) {
            x += moveSpeed;
        }
        else if (playerHorizontalState == PlayerHorizontalStates.RightWallJumping) {
            x += - moveSpeed;
        }
    }
    else {
        jumpAmount = 0;
        playerVerticalState = PlayerVerticalStates.Floating;
    }
}

function FloatingBehaviorAndJudgeOnGroundState() {
    if (playerVerticalState != PlayerVerticalStates.Floating) return;

    y = playerHorizontalState == PlayerHorizontalStates.ShootingStar
        ? y + 7 : y + gravity;

    if (playerHorizontalState == PlayerHorizontalStates.LeftWallJumping) {
        x += moveSpeed;
    }
    else if (playerHorizontalState == PlayerHorizontalStates.RightWallJumping) {
        x += - moveSpeed;
    }

    if (judgeIsOnGround()) {
        playerVerticalState = PlayerVerticalStates.OnGround;
        playerHorizontalState = PlayerHorizontalStates.Idle;
    }
}

function judgeIsOnGround() {
    return y + playerHeight > groundBottomYPos;
}

function JudgeIsOnSealing() {
    return y - 1 < groundTopYPos;
}

function judgeIsLeftMoveLimit() {
    return x - 1 < wallLeftXPos;
}

function judgeIsRightMoveLimit() {
    return x + playerWidth + 1 > wallRightXPos;
}

export function JudgeIsHitBullet(bulletRight, bulletLeft, bulletBottom, bulletTop) {
    if (playerBodyState != PlayerBodyStates.isNormal) return;
    //console.log("judgeIsHitBullet" + "br:" + bulletRight + "pl:" + playerLeftPos);

    if (bulletTop > playerFootYPos || bulletBottom < playerHeadYPos) {
        console.log("noHit");
        return false;
    }

    if (bulletRight > playerLeftXPos && playerRightXPos > bulletRight) {
        //        console.log("bulletRight = " + bulletRight);
        //        console.log("playerLeft = " + playerLeftPos);
        playerBodyState = PlayerBodyStates.isDamaged;
        return true;
    }
    else if (bulletLeft < playerRightXPos && playerLeftXPos < bulletLeft) {
        //        console.log("bulletLeft = " + bulletLeft);
        //        console.log("playerRight = " + playerRightPos);
        playerBodyState = PlayerBodyStates.isDamaged;
        return true;
    }

    return false;
}

export function JudgeIsHitEnemy(enemyLeft, enemyRight, enemyHead, enemyFoot) {
    if (playerVerticalState == PlayerVerticalStates.Floating) return;
    if (playerBodyState != PlayerBodyStates.isNormal) return;

    if (enemyHead > playerFootYPos || enemyFoot < playerHeadYPos) {
        return;
    }

    if (enemyRight > playerLeftXPos && playerRightXPos > enemyRight) {
        playerBodyState = PlayerBodyStates.isDamaged;
        console.log("Hit enemy");
    }
    else if (enemyLeft < playerRightXPos && playerLeftXPos < enemyLeft) {
        playerBodyState = PlayerBodyStates.isDamaged;
        console.log("hit enemy");
    }
}

function DamagedBehavior() {
    if (playerBodyState != PlayerBodyStates.isDamaged) return;

    DecreaseLife();
    playerBodyState = PlayerBodyStates.isInvincible;
    console.log("decrease life");
    if (playerLife <= 0) isSetImage = false;

}

function InvincibleBehavior() {
    if (playerLife <= 0) return;
    if (playerBodyState != PlayerBodyStates.isInvincible) return;

    if (invincibleTimeCounter > invincibleTime) {
        invincibleTimeCounter = 0;
        playerBodyState = PlayerBodyStates.isNormal;
        isSetImage = true;
        return;
    }

    invincibleTimeCounter += 1;
    //console.log(invincibleTimeCounter);

    if (invincibleTimeCounter % 5 == 0)
        isSetImage = !isSetImage;
}

function SetImage() {
    return playerVerticalState == PlayerVerticalStates.Floating ?
        image2 : image1;
}






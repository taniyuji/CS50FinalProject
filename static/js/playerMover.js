import { groundBottomYPos, groundTopYPos, wallLeftXPos, wallRightXPos } from "./stageSetter.js";
import getKeyState, { keys } from "./getInput.js";
import { DecreaseLife, life } from "./HPController.js";

const canvas = document.getElementById("maincanvas");
const image1 = document.getElementById("playerImage1");
const image2 = document.getElementById("playerImage2");
const ctx = canvas.getContext("2d");

var playerLife = 5;
var playerWidth = 60;
var playerHeight = 15;
var addWidth = 10;
var addHeight = 10;
var jumpLimit = 50;
var jumpAmount = 0;
var moveSpeed = 6;
var jumpSpeed = -3;
var gravity = 3;
var climbingSpeed = 2;
var onGroundYPos = groundBottomYPos - playerHeight;
var onSealingPos = groundTopYPos;
var leftMoveLimitPos = wallLeftXPos;
var rightMoveLimitPos = wallRightXPos - playerWidth;
var isHitBullet = false;

export var playerRightPos = x + playerWidth;
export var playerLeftPos = x;
export var playerFootPos = y + playerHeight;
export var playerHeadPos = y;

var PlayerHorizontalState = {
    Idle: 1,
    MovingLeft: 2,
    MovingRight: 3,
    LeftWallJumping: 4,
    RightWallJumping: 5,
    ShootingStar: 6,
}

var horizontalState = PlayerHorizontalState.Idle;

export var PlayerVerticalStates = {
    OnGround: 1,
    Jumping: 2,
    Floating: 3,
    ClimbingLeft: 4,
    ClimbingRight: 5,
    OnSealing: 6,
}

export var playerVerticalState = PlayerVerticalStates.OnGround;

var x = wallRightXPos - playerWidth;
var y = groundBottomYPos - playerHeight;

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

    if (isHitBullet) {
        DecreaseLife();
        isHitBullet = false;
        console.log("hitBullet : " + playerLife);
    }

   if(life > 0) ctx.drawImage(image, x, y, width, height);
}

function UpdateExportData() {
    playerRightPos = x + playerWidth;
    playerLeftPos = x;
    playerFootPos = y + playerHeight;
    playerHeadPos = y;
}

function JudgeIdleAndFloatingState() {
    if (getKeyState(keys.upAllow)) return;

    if (!judgeIsOnGround()
        && (playerVerticalState == PlayerVerticalStates.ClimbingLeft
            || playerVerticalState == PlayerVerticalStates.ClimbingRight
            || playerVerticalState == PlayerVerticalStates.OnSealing))
        playerVerticalState = PlayerVerticalStates.Floating;

    horizontalState = PlayerHorizontalState.Idle;
}

function JudgeRightAllowState() {
    if (!getKeyState(keys.rightAllow)) return;
    if (playerVerticalState == PlayerVerticalStates.ClimbingLeft) return;
    if (horizontalState == PlayerHorizontalState.LeftWallJumping) return;
    if (horizontalState == PlayerHorizontalState.RightWallJumping) return;
    if (horizontalState == PlayerHorizontalState.ShootingStar) return;

    horizontalState = PlayerHorizontalState.MovingRight;
}

function JudgeLeftAllowState() {
    if (!getKeyState(keys.leftAllow)) return;
    if (playerVerticalState == PlayerVerticalStates.ClimbingRight) return;
    if (horizontalState == PlayerHorizontalState.LeftWallJumping) return;
    if (horizontalState == PlayerHorizontalState.RightWallJumping) return;
    if (horizontalState == PlayerHorizontalState.ShootingStar) return;

    horizontalState = PlayerHorizontalState.MovingLeft;
}

function JudgeSpaceState() {
    if (!getKeyState(keys.space)) return;
    if (playerVerticalState == PlayerVerticalStates.Jumping) return;
    if (playerVerticalState == PlayerVerticalStates.Floating) return;

    if (playerVerticalState == PlayerVerticalStates.ClimbingLeft)
        horizontalState = PlayerHorizontalState.LeftWallJumping;
    else if (playerVerticalState == PlayerVerticalStates.ClimbingRight)
        horizontalState = PlayerHorizontalState.RightWallJumping;
    else if (playerVerticalState == PlayerVerticalStates.OnSealing) {
        horizontalState = PlayerHorizontalState.ShootingStar;
    }

    playerVerticalState = PlayerVerticalStates.Jumping;
}

function JudgeUpArrowState() {
    if (!getKeyState(keys.upAllow)) return;
    if (playerVerticalState == PlayerVerticalStates.Jumping) return;
    if (playerVerticalState == PlayerVerticalStates.Floating) return;
    if (horizontalState == PlayerHorizontalState.LeftWallJumping) return;
    if (horizontalState == PlayerHorizontalState.RightWallJumping) return;
    if (horizontalState == PlayerHorizontalState.ShootingStar) return;

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
    if (horizontalState != PlayerHorizontalState.MovingLeft
        && horizontalState != PlayerHorizontalState.MovingRight) return;

    if (horizontalState == PlayerHorizontalState.MovingRight) {
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
        && horizontalState != PlayerHorizontalState.ShootingStar) {
        y += jumpSpeed;
        jumpAmount += -jumpSpeed;

        if (horizontalState == PlayerHorizontalState.LeftWallJumping) {
            x += moveSpeed;
        }
        else if (horizontalState == PlayerHorizontalState.RightWallJumping) {
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

    y = horizontalState == PlayerHorizontalState.ShootingStar
        ? y + 7 : y + gravity;

    if (horizontalState == PlayerHorizontalState.LeftWallJumping) {
        x += moveSpeed;
    }
    else if (horizontalState == PlayerHorizontalState.RightWallJumping) {
        x += - moveSpeed;
    }

    if (judgeIsOnGround()) {
        playerVerticalState = PlayerVerticalStates.OnGround;
        horizontalState = PlayerHorizontalState.Idle;
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
    //console.log("judgeIsHitBullet" + "br:" + bulletRight + "pl:" + playerLeftPos);

    if (bulletTop > playerFootPos || bulletBottom < playerHeadPos) {
        console.log("noHit");
        return false;
    }
    
    if (bulletRight > playerLeftPos && playerRightPos > bulletRight)
    {
        console.log("bulletRight = " + bulletRight);
        console.log("playerLeft = " + playerLeftPos);
        isHitBullet = true;
        return true;
    }
    else if (bulletLeft < playerRightPos && playerLeftPos < bulletLeft)
    {
        console.log("bulletLeft = " + bulletLeft);
        console.log("playerRight = " + playerRightPos);
        isHitBullet = true;
        return true;
    }
    
    return false;
}

function SetImage() {
    return playerVerticalState == PlayerVerticalStates.Floating ?
        image2 : image1;
}






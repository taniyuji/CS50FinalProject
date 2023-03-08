var groundWidth = 1500;
var groundHeight = 50;
var wallWidth = 20;
var wallHeight = 1500;

export var groundTopYPos = -25 + groundHeight;
export var groundBottomYPos = 143;
export var wallLeftXPos = wallWidth;
export var wallRightXPos = 970;

const canvas = document.getElementById("maincanvas");
const ctx = canvas.getContext("2d");

window.addEventListener("load", setStage);

export default function setStage() {
    var groundImage = document.getElementById("groundImage")
;
    ctx.drawImage(groundImage, 0, groundBottomYPos, groundWidth, groundHeight);
    ctx.drawImage(groundImage, 0, groundTopYPos - groundHeight, groundWidth, groundHeight);
    ctx.drawImage(groundImage, wallLeftXPos - wallWidth, -50, wallWidth, wallHeight);
    ctx.drawImage(groundImage, wallRightXPos, -50, wallWidth, wallHeight);
}
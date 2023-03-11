import { playerHeadYPos, playerLeftXPos } from "./playerMover.js";

const canvas = document.getElementById("maincanvas");
const ctx = canvas.getContext("2d");

export var playerLife = 3;

var width = 20;
var height = 8;
var yPos = 0;
var xPos = 0;
var xInterval = 25;

let LifeImages = [document.getElementById("HeartImage"),
document.getElementById("HeartImage"),
document.getElementById("HeartImage")]

export default function SetLifeUI() {
    xPos = playerLeftXPos;
    yPos = playerHeadYPos - height - 5;
    for (var i = 0; i < playerLife; i++) {
        ctx.drawImage(LifeImages[i], xPos, yPos, width, height);
        xPos += xInterval;
    }
}

export function DecreaseLife() {
    playerLife--;
}
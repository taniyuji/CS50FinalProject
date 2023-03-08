const canvas = document.getElementById("maincanvas");
const ctx = canvas.getContext("2d");

export var life = 3;

var width = 50;
var height = 20;
var yPos = 0;
var xPos = 50;
var xInterval = 70;

let LifeImages = [document.getElementById("HeartImage"),
document.getElementById("HeartImage"),
document.getElementById("HeartImage")]

export default function SetLifeUI()
{
    for (var i = 0; i < life; i++) {
        ctx.drawImage(LifeImages[i], xPos, yPos, width, height);
        xPos += xInterval;
    }

    xPos = 50;
}

export function DecreaseLife() {
    life--;
}
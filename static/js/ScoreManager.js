import { defeatedTime as defeatedTime1 } from "./EnemyMover.js";
import { defeatedTime as defeatedTime2 } from "./EnemyMover2.js";

import { playerLife } from "./HPController.js";

const canvas = document.getElementById("maincanvas");
const ctx = canvas.getContext("2d");

export var playerScore = 0;
var addScoreAmount = 10;
var defeatedTimeSum = 0;
var beforeDefeatedTime = defeatedTime1;
var beforePlayerLife = playerLife;
var scoreBonus = 1;

export default function ShowScore() {

    if (playerLife <= 0) return;

    if (defeatedTimeSum != beforeDefeatedTime) {
        scoreBonus = beforePlayerLife == playerLife ?
            scoreBonus + 0.1 : 1;
        
        AddScore();

        beforeDefeatedTime = defeatedTimeSum;
        beforePlayerLife = playerLife;
    }

    ctx.font = '20px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255)';
    ctx.fillText('your score : ' + parseInt(playerScore, 10), 30, 17);

    defeatedTimeSum = defeatedTime1 + defeatedTime2;
}

function AddScore() {
    playerScore += parseInt(addScoreAmount * defeatedTimeSum * scoreBonus);
}
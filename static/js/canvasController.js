import movePlayer from "./playerMover.js";
import setStage from "./stageSetter.js";
import { MoveEnemy as enemy1, defeatedTime } from "./EnemyMover.js";
import { MoveEnemy as enemy2} from "./EnemyMover2.js";
import SetLifeUI from "./HPController.js";
import ShowScore from "./ScoreManager.js";
import openRegister from "./RankingPopUp.js";
import getKeyState, { keys } from "./getInput.js";

var titleImage = document.getElementById("TitleImage");
const canvas = document.getElementById("maincanvas");
const ctx = canvas.getContext("2d");

window.addEventListener("load", update);

ctx.mozimageSmoothingEnabled = false;
ctx.msimageSmoothingEnabled = false;
ctx.webkitimageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;

var isGameStarted = false;

function update() {
    ctx.clearRect(0, 0, 9999, 9999);

    JudgeGameStart();

    if (!isGameStarted) return;

    enemy1();
    if (defeatedTime > 5) enemy2();
    movePlayer();
    setStage();
    SetLifeUI();
    ShowScore();
    openRegister();

    window.requestAnimationFrame(update);
}

function JudgeGameStart()
{
    if (isGameStarted) return;

    if (getKeyState(keys.space)) {
        isGameStarted = true;
    }
    else {
        ctx.font = '25px Arial';
        ctx.fillStyle = 'rgba(255, 0, 0)';
        ctx.drawImage(titleImage, 0, 0, 1000, 120);
        ctx.fillText('Please press enter key', 345, 143);
        window.requestAnimationFrame(update);
    }
}
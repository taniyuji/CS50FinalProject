import movePlayer, { playerLeftPos } from "./playerMover.js";
import setStage from "./stageSetter.js";
import MoveEnemy from "./EnemyMover.js";
import SetLifeUI from "./HPController.js";

const canvas = document.getElementById("maincanvas");
const ctx = canvas.getContext("2d");

window.addEventListener("load", update);

function update() {

    ctx.clearRect(0, 0, 9999, 9999);

    movePlayer();
    MoveEnemy();
    setStage();
    SetLifeUI();

    window.requestAnimationFrame(update);
}
import { playerLife } from "./HPController.js";
import { playerScore } from "./ScoreManager.js";

$('#open_register').on('click', function () {
    $('.popup').addClass('show').fadeIn();
});

$('#close_register').on('click', function () {
    $('.popup').fadeOut();
});

var isRegisterOpened = false;

export default function openRegister() {
    if (playerLife > 0) return;

    if (!isRegisterOpened) {
        document.getElementById("score_show").innerHTML = playerScore;
        document.getElementById("score").value = playerScore;
            $('.popup').addClass('show').fadeIn();
    }
    isRegisterOpened = true;
}
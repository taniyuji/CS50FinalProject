
var input_key_buffer = new Array();

export var keys = {
    rightAllow: 1,
    leftAllow: 2,
    upAllow: 3,
    space: 4,
}

window.addEventListener("keydown", handleKeydown);
function handleKeydown(e) {
    //console.log("key down : " + e.keyCode);
    input_key_buffer[e.keyCode] = true;
    //console.log("set keybuffer" + input_key_buffer[e.keyCode]);
}

window.addEventListener("keyup", handleKeyup);
function handleKeyup(e) {
    //console.log("key up : " + e.keyCode);
    input_key_buffer[e.keyCode] = false;
}

export default function getKeyState(requestedKeys) {
    switch (requestedKeys) {
        case keys.leftAllow: return input_key_buffer[37];
        case keys.upAllow: return input_key_buffer[38];
        case keys.rightAllow: return input_key_buffer[39];
        case keys.space: return input_key_buffer[32]
    }
}





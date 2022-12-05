const CANVAS = document.getElementById("canvas")
const CTX = CANVAS.getContext("2d")
let lastRender = 0

if(Math.min(window.innerWidth / 1920, window.innerHeight / 1080) < 1){
    console.log('assuming low res screen');
    CTX.imageSmoothingEnabled = true; // turn it on for low res screens
}else{
    console.log('assuming high res screen');
    CTX.imageSmoothingEnabled = false; // turn it off for high res screens.
}

//methods
const pause = () => {
    paused = !paused
    if (paused) pause_menu.showModal()
    else pause_menu.close()
    console.log("game is paused");
}
const handle_keydown = (e) => {
    if (paused) return
    if (e.keyCode < 41 && e.keyCode > 36) {
        direction = e.keyCode
        return
    }
    pause()
}

//textures
CTX.font = "50px Arial";
CTX.strokeStyle = '#FFF';

//game variables
let apple = [20, 10]
//56 + (16 by 30 grid)
let snake = [[15, 7], [15, 8], [15, 9]]
let score = 0
let ms_per_tile = 500
let direction = 40
let ms_before_moving = 500

//controls / html elements
let paused = false
const pause_menu = document.getElementById('pause_menu')
document.getElementById("unpause_btn").onclick = pause
document.getElementById("body").addEventListener("keydown", handle_keydown);

//main
function update(progress) {
    // return when paused
    if (paused) return
    // output fps and rond the progress for performance
    console.log("fps:", Math.round(1000/progress));
    //round progress for performance
    const progressRound = Math.round(progress)

    ms_before_moving -= progressRound
    if (ms_before_moving <= 0) {
        ms_before_moving = ms_per_tile
        //move
        const el = snake[snake.length-1]
        switch (direction) {
            case 38:
                snake.push([el[0], el[1] - 1])
                break;
            case 39:
                snake.push([el[0] + 1, el[1]])
                break;
            case 40:
                snake.push([el[0], el[1] + 1])
                break;
            case 37:
                snake.push([el[0] - 1, el[1]])
                break;
            default:
                break;
        }
        //check for apples / death
        let hit_apple = false
        for (let i = 0; i < snake.length; i++) {
            const el = snake[i];
            if (el[0] === apple[0] && el[1] === apple[1]) {
                hit_apple = true
                break
            }
        }
        if (hit_apple) {
            ms_per_tile = ms_per_tile - (ms_per_tile>>4)
            let hit_snake = true
            while (hit_snake) {
                hit_snake = false
                apple = [Math.floor(Math.random() * 29) + 1, Math.floor(Math.random() * 15) + 1]
                for (let i = 0; i < snake.length; i++) {
                    const el = snake[i];
                    if (el[0] === apple[0] && el[1] === apple[1]) {
                        hit_snake = true
                        break
                    }
                }
            }
        } else {
            const element = snake.shift()
        }
        let hit_self = false
        for (let i = 0; i < snake.length - 1; i++) {
            const el = snake[i];
            if (el[0] === snake[snake.length-1][0] && el[1] === snake[snake.length-1][1]) {
                hit_self = true
                break
            }
        }
        let hit_border = snake[snake.length-1][0] < 0 || snake[snake.length-1][0] > 29 ||
            snake[snake.length-1][1] < 0 || snake[snake.length-1][1] > 15
        if (hit_self || hit_border) {
            snake = [[15, 7], [15, 8], [15, 9]]
            apple = [20, 10]
            score = 0
            ms_per_tile = 500
            direction = 40
            ms_before_moving = 500
        }
    }

    score += progressRound
}

function draw() {
    if (paused) return
    // clear canvas
    CTX.clearRect(0, 0, CANVAS.width, CANVAS.height)
    CTX.fillStyle = "#FFF"
    CTX.fillText(Math.floor(score>>5), 128, 50);

    CTX.fillStyle = "#00FF00";
    CTX.beginPath();
    for (let i = 1; i < 30; i++) {
        CTX.moveTo(i<<6, 56);
        CTX.lineTo(i<<6, 1080);
    }
    for (let i = 0; i < 16; i++) {
        CTX.moveTo(0, 56 + (i<<6));
        CTX.lineTo(1920, 56 + (i<<6));
    }
    CTX.stroke();

    for (let i = 0; i < snake.length; i++) {
        const el = snake[i];
        CTX.fillRect((el[0]<<6) + 4, (el[1]<<6) + 60, 56, 56)
    }

    CTX.fillStyle = "#FF0000";
    CTX.fillRect((apple[0]<<6) + 4, (apple[1]<<6) + 60, 56, 56)
}

function loop(timestamp) {
    //get time
    let progress = timestamp - lastRender

    //update using time
    update(progress)

    //draw
    draw()

    //save time
    lastRender = timestamp

    //tell browser to render again
    window.requestAnimationFrame(loop)
}
//run game
window.onload = window.requestAnimationFrame(loop)
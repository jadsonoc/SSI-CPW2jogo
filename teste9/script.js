var cursor = document.querySelector('.cursor');
var body = document.body;
var easyMode = false;

document.addEventListener('mousemove', function (mMoveEvt) {
    let xPos = mMoveEvt.pageX;
    let yPos = mMoveEvt.pageY;
    cursor.style.left = xPos + 'px';
    cursor.style.top = yPos + 'px';
})

const menuCanvas = document.getElementById('menuCanvas');
const menuCtx = menuCanvas.getContext('2d');
menuCanvas.width = window.innerWidth;
menuCanvas.height = window.innerHeight;

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const collisionCanvas = document.getElementById('collisionCanvas');
const collisionCtx = collisionCanvas.getContext('2d');
collisionCanvas.width = window.innerWidth;
collisionCanvas.height = window.innerHeight;

const PrimaryColors = {
    red: 'red',
    yellow: '#ffff00',
    blue: '#4f6000'
};

const SecondaryColors = {
    orange: 0,
    green: 1,
    violet: 2,
};


let level = 1;
let bombs = 2;
let score = 0;
let gameOver = false; 

let timeToNextEnemy = 0;
let enemyInterval = 500;
let lastTime = 0;
let barrierColor = '';

let enemies = [];
let barriers = [];


class Barrier {
    constructor() {
        this.colors = ['orange', 'green', 'purple'];
        this.colors.sort(() => .5 - Math.random());
        this.color = this.colors[0];
        this.coinSound = new Audio();
        this.coinSound.src = 'plus_up.wav';
        this.failSound = new Audio();
        this.failSound.src = 'end.wav';
    }

    draw() {  
        ctx.fillStyle = this.colors[0]; //this.colors[Math.floor(Math.random() * 3)];
        ctx.fillRect(0, 0, 40, 1000);
    }

    playCoinSound() {
        this.coinSound.play();
    }

    playFailSound() {
        this.failSound.play();
    }
}

barriers.push(new Barrier());
barrierColor = barriers[0].color;

class Ball {
    constructor() {
        this.spriteWidth = 50;
        this.spriteHeight = 50;
        this.sizeModifier = Math.random() * 1 + 1.2;
        this.width = this.spriteWidth * this.sizeModifier;
        this.height = this.spriteHeight * this.sizeModifier;
        this.x = canvas.width;
        this.y = Math.random() * (canvas.height - this.height);
        this.directionX = Math.random() * 2 + 0.4;
        this.directionY = Math.random() * 5 - 2.5;
        this.markedForDeletion = false;
        this.image = new Image();
        this.frame = 0;
        this.maxFrame = 1;
        this.timeSinceFlap = 0;
        this.flapInterval = Math.random() * 50 + 50;
        this.randomColors = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];
        this.color = 'rgb(' + this.randomColors[0] + ',' + this.randomColors[1] + ',' + this.randomColors[2] + ')';
        if (barrierColor == 'orange') {
            this.colors = ['red', 'yellow'];
        } else if (barrierColor == 'green') {
            this.colors = ['blue', 'yellow'];
        } else {
            this.colors = ['red', 'blue'];
        }
        this.colors.sort(() => .5 - Math.random());
        this.realColor = this.colors[0];
        this.image.src = `./images/${this.realColor}.png`;
        this.radius = Math.random() * this.sizeModifier;
        this.sound = new Audio();
        this.sound.src = 'paint.wav';
    }

    update(deltaTime) {
        if (this.y < 0 || this.y > canvas.height - this.height) {
            this.directionY = this.directionY * -1;
        }
        if (easyMode) {
            this.x -= (this.directionX/1.5);
            this.y += (this.directionY/2);
        } else {
            this.x -= this.directionX;
            this.y += this.directionY;
        }
        if (this.x < 0 - this.width) this.markedForDeletion = true;
        
        if (this.x < (0 - this.width) && this.realColor == barrierColor) {
            score++;
            barriers[0].playCoinSound();
        }
        if (this.x < (0 - this.width) && this.realColor != barrierColor) {
            gameOver = true;
            barriers[0].playFailSound();
        }

     
    }

    draw() {
        collisionCtx.fillStyle = this.color; 
        collisionCtx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth,
            this.spriteHeight, this.x, this.y, this.width, this.height);
    }

    playSound() {
        return this.sound.play();
    }
}

let explosions = [];
class Explosion {
    constructor(x, y, size) {
        this.image = new Image();
        this.image.src = './images/boom.png';
        this.spriteWidth = 200;
        this.spriteHeight = 179;
        this.size = size;
        this.x = x;
        this.y = y;
        this.frame = 0;
        this.sound = new Audio();
        this.sound.src = 'boom.wav';
        this.timeSinceLastFrame = 0;
        this.frameInterval = 200;
        this.markedForDeletion = false;
    }

    update(deltaTime) {
        if (this.frame === 0) this.sound.play();
        this.timeSinceLastFrame += deltaTime;
        if (this.timeSinceLastFrame > this.frameInterval) {
            this.frame++;
            this.timeSinceLastFrame = 0;
            if (this.frame > 5) this.markedForDeletion = true;
        }
    }

    draw() {
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0,
            this.spriteWidth, this.spriteHeight, this.x, this.y - this.size / 4, this.size, this.size);
    }
}




function drawScoreBoard() {
    ctx.font = '28px Impact';
    ctx.fillStyle = 'black';
    ctx.fillText('Bombas: ' + bombs + ' | Pontos: ' + score, 60, 35);
    ctx.fillStyle = 'lightgreen';
    ctx.fillText('Bombas: ' + bombs + ' | Pontos: ' + score, 62, 37);
}

function drawGameOver() {
    ctx.textAlign = 'center';
    ctx.fillStyle = 'black';
    ctx.fillText('GAME OVER, você fez ' + score + ' pontos', canvas.width / 2, canvas.height / 2); 
    ctx.fillStyle = 'white';
    ctx.fillText('GAME OVER, você fez ' + score + ' pontos', canvas.width / 2 + 5, canvas.height / 2 + 5 ); 
}

function drawTips() {
    let tipImage = new Image();
    if (barrierColor == 'green')
        tipImage.src = './images/byg_p.png'
    else if (barrierColor == 'orange') 
        tipImage.src = './images/yro_p.png'
    else if (barrierColor == 'purple') 
        tipImage.src = './images/rbp_p.png'
    ctx.drawImage(tipImage, canvas.width-tipImage.width-20, 20, tipImage.width, tipImage.height);
}

window.addEventListener('click', function (clickEvent) {
    const detectPixelColor = collisionCtx.getImageData(clickEvent.x, clickEvent.y, 1, 1);
    const pixelColor = detectPixelColor.data;
    //Verifica colisao pela cor
    enemies.forEach(enemy => {
        if (enemy.randomColors[0] === pixelColor[0] && enemy.randomColors[1] === pixelColor[1] && enemy.randomColors[2] === pixelColor[2]) {
            const enemyOriginalColor = enemy.realColor;

            if (enemy.realColor == 'red' && cursor.style.background == 'yellow') {
                enemy.image.src = './images/orange.png';
                enemy.realColor = 'orange';
                enemy.playSound();
            } else if (enemy.realColor == 'yellow' && cursor.style.background == 'red') {
                enemy.image.src = './images/orange.png';
                enemy.realColor = 'orange';
                enemy.playSound();
            } else if (enemy.realColor == 'blue' && cursor.style.background == 'yellow') {
                enemy.image.src = './images/green.png';
                enemy.realColor = 'green';
                enemy.playSound();
            } else if (enemy.realColor == 'yellow' && cursor.style.background == 'blue') {
                enemy.image.src = './images/green.png';
                enemy.realColor = 'green';
                enemy.playSound();
            } else if (enemy.realColor == 'blue' && cursor.style.background == 'red') {
                enemy.image.src = './images/purple.png';
                enemy.realColor = 'purple';
                enemy.playSound();
            } else if (enemy.realColor == 'red' && cursor.style.background == 'blue') {
                enemy.image.src = './images/purple.png';
                enemy.realColor = 'purple';
                enemy.playSound();
            }

    
            if (barrierColor == 'purple') {
                if (enemy.realColor == 'green' || enemy.realColor == 'orange') {
                    if (bombs > 0) {
                        explosions.push(new Explosion(enemy.x, enemy.y, enemy.width));
                        enemy.markedForDeletion = true;
                        bombs--;
                    } else {
                        let errorSound = new Audio();
                        errorSound.src = 'error.mp3';
                        errorSound.play();
                        enemy.realColor = enemyOriginalColor;
                        enemy.image.src = `./images/${enemyOriginalColor}.png`;
                    }
                }  
            } else if (barrierColor == 'orange') {
                if (enemy.realColor == 'green' || enemy.realColor == 'purple') {
                    if (bombs > 0) {
                        explosions.push(new Explosion(enemy.x, enemy.y, enemy.width));
                        enemy.markedForDeletion = true;
                        bombs--;
                    } else {
                        let errorSound = new Audio();
                        errorSound.src = 'error.mp3';
                        errorSound.play();
                        enemy.realColor = enemyOriginalColor;
                        enemy.image.src = `./images/${enemyOriginalColor}.png`;
                    }
                }
            }
            else if (barrierColor == 'green') {
                if (enemy.realColor == 'orange' || enemy.realColor == 'purple') {
                    if (bombs > 0) {
                        explosions.push(new Explosion(enemy.x, enemy.y, enemy.width));
                        enemy.markedForDeletion = true;
                        bombs--;
                    } else {
                        let errorSound = new Audio();
                        errorSound.src = 'error.mp3';
                        errorSound.play();
                        enemy.realColor = enemyOriginalColor;
                        enemy.image.src = `./images/${enemyOriginalColor}.png`;
                    }
                }
            }

            //alert('jesus');
            //enemy.markedForDeletion = true;
            //explosions.push(new Explosion(enemy.x, enemy.y, enemy.width));
        }
    })
})

const keys = {
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    }
}

window.addEventListener("keydown", e => {
    let key = e.key;
    switch (key) {
        case "a":
        case "A":
            keys.a.pressed = true;
            cursor.style.background = 'yellow';
            if (barrierColor == 'purple') {
                body.style.cursor = 'url(images/bomb3.cur), default';
                cursor.style.display = 'none';
            } else {
                body.style.cursor = 'none';
                cursor.style.display = 'block';
            }
            break;
        case "s":
        case "S":
            keys.s.pressed = true;
            cursor.style.background = 'red';
            if (barrierColor == 'green') {
                body.style.cursor = 'url(images/bomb3.cur), default';
                cursor.style.display = 'none';
            } else {
                body.style.cursor = 'none';
                cursor.style.display = 'block';
            }
            break;
        case "d":
        case "D":
            keys.d.pressed = true;
            cursor.style.background = 'blue';
            if (barrierColor == 'orange') {
                body.style.cursor = 'url(images/bomb3.cur), default';
                cursor.style.display = 'none';
            } else {
                body.style.cursor = 'none';
                cursor.style.display = 'block';
            }
            break;
    }
});

window.addEventListener("keyup", e => {
    let key = e.key;

    switch (key) {
        case "A":
        case "a":
            keys.a.pressed = false;
            break;
        case "S":
        case "s":
            keys.s.pressed = false;
            break;
        case "D":
        case "d":
            keys.d.pressed = false;
            break;
    }
});

//Funcao para as ocorrencias ficarem constante independente do poder de processamento
function game(timeStamp) {
    menuCtx.clearRect(0, 0, menuCanvas.width, menuCanvas.height);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    collisionCtx.clearRect(0, 0, canvas.width, canvas.height);
    let deltaTime = timeStamp - lastTime;
    lastTime = timeStamp
    timeToNextEnemy += deltaTime;
    if (timeToNextEnemy > enemyInterval) {
        enemies.push(new Ball());
        if (easyMode)
            timeToNextEnemy = -2500;
        else 
            timeToNextEnemy = 0;
        enemies.sort(function (a, b) {
            return a.width - b.width; 
        })
    };
    if (easyMode) drawTips();
    drawScoreBoard();
    //Array literal and spread operator
    [...enemies, ...explosions].forEach(enemy => enemy.update(deltaTime));
    [ ...enemies, ...explosions].forEach(enemy => enemy.draw());
    barriers[0].draw();
    enemies = enemies.filter(enemy => !enemy.markedForDeletion);
    explosions = explosions.filter(explosion => !explosion.markedForDeletion);
    if (!gameOver) requestAnimationFrame(game);
    else drawGameOver();
}


function menu() {
    const imgBackground = new Image();
    imgBackground.src = './images/bkg.jpg';
    const imgMenu = new Image();
    imgMenu.src = './images/aquarela3.png';
    menuCtx.clearRect(0, 0, menuCanvas.width, menuCanvas.height);
    menuCtx.drawImage(imgBackground, 0, 0, menuCanvas.width, menuCanvas.height);
    menuCtx.drawImage(imgMenu, menuCanvas.width/3, menuCanvas.height/5, 500, 500);
    requestAnimationFrame(menu);

    window.addEventListener('click', function (clickEvent) {
        const detectPixelColor = menuCtx.getImageData(clickEvent.x, clickEvent.y, 3, 3);
        const pixelColor = detectPixelColor.data;
        if (pixelColor[0] >= 200 && pixelColor[0] < 250) {
            body.style.cursor = 'none';
            cursor.style.display = 'block';
            document.getElementById('menuCanvas').style.display = 'none';
            game(0);
        } else if (pixelColor[0] >= 110 && pixelColor[0] < 180) {
            body.style.cursor = 'none';
            cursor.style.display = 'block';
            document.getElementById('menuCanvas').style.display = 'none';
            easyMode = true;
            game(0);
        }
    })
//f5de2c c71859
}

menu();
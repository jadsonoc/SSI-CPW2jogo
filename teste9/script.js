
var cursor = document.querySelector('.cursor');

document.addEventListener('mousemove', function (mMoveEvt) {
    let xPos = mMoveEvt.pageX;
    let yPos = mMoveEvt.pageY;
    cursor.style.left = xPos + 'px';
    cursor.style.top = yPos + 'px';
})

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
    yellow: 1,
    blue: 2,
};

const SecondaryColors = {
    orange: 0,
    green: 1,
    violet: 2,
};

ctx.font = '50px Impact';
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
        this.barrierColor = this.colors[0];
        this.sound = new Audio();
        this.sound.src = 'crossBarrier.wav';
    }

    draw() {  
        ctx.fillStyle = this.colors[0]; //this.colors[Math.floor(Math.random() * 3)];
        ctx.fillRect(0, 0, 40, 1000);
    }

    sound() {
        this.sound.play();
    }
}

barriers.push(new Barrier());

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
        if (barriers[0].barrierColor == 'orange') {
            this.colors = ['red', 'yellow'];
        } else if (barriers[0].barrierColor == 'green') {
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
        this.x -= this.directionX;
        this.y += this.directionY;
        if (this.x < 0 - this.width) this.markedForDeletion = true;
        /*
        this.timeSinceFlap += deltaTime;
        if (this.timeSinceFlap > this.flapInterval) {
            if (this.frame > this.maxFrame)
                this.frame = 0;
            else this.frame++;
            this.timeSinceFlap = 0;
        }
        */
        
        if (this.x < (0 - this.width) && this.realColor == barriers[0].barrierColor) {
            score++;
        }
        if (this.x < (0 - this.width) && this.realColor != barriers[0].barrierColor)
            gameOver = true;
     
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




function drawScore() {
    ctx.fillStyle = 'black';
    ctx.fillText('Pontos: ' + score, 50, 75);
    ctx.fillStyle = 'white';
    ctx.fillText('Pontos: ' + score, 55, 80);
}

function drawGameOver() {
    ctx.textAlign = 'center';
    ctx.fillStyle = 'black';
    ctx.fillText('GAME OVER, você fez ' + score + ' pontos', canvas.width / 2, canvas.height / 2); 
    ctx.fillStyle = 'white';
    ctx.fillText('GAME OVER, você fez ' + score + ' pontos', canvas.width / 2 + 5, canvas.height / 2 + 5 ); 
}

window.addEventListener('click', function (clickEvent) {
    const detectPixelColor = collisionCtx.getImageData(clickEvent.x, clickEvent.y, 1, 1);
    const pixelColor = detectPixelColor.data;
    //Verifica colisao pela cor
    enemies.forEach(enemy => {
        if (enemy.randomColors[0] === pixelColor[0] && enemy.randomColors[1] === pixelColor[1] && enemy.randomColors[2] === pixelColor[2]) {
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
            
            if (barriers[0].barrierColor == 'purple') {
                if (enemy.realColor == 'green' || enemy.realColor == 'orange') {
                    explosions.push(new Explosion(enemy.x, enemy.y, enemy.width));
                    enemy.markedForDeletion = true;
                    score--;
                }
            } else if (barriers[0].barrierColor == 'orange') {
                if (enemy.realColor == 'green' || enemy.realColor == 'purple') {
                    explosions.push(new Explosion(enemy.x, enemy.y, enemy.width));
                    enemy.markedForDeletion = true;
                    score--;
                }
            }
            else if (barriers[0].barrierColor == 'green') {
                if (enemy.realColor == 'orange' || enemy.realColor == 'purple') {
                    explosions.push(new Explosion(enemy.x, enemy.y, enemy.width));
                    enemy.markedForDeletion = true;
                    score--;
                }
            }

            //alert('jesus');
            //enemy.markedForDeletion = true;
            //explosions.push(new Explosion(enemy.x, enemy.y, enemy.width));
        }
    })
})

const keys = {
    r: {
        pressed: false
    },
    g: {
        pressed: false
    },
    b: {
        pressed: false
    }
}

window.addEventListener("keydown", e => {
    let key = e.key;
    switch (key) {
        case "a":
            keys.r.pressed = true;
            cursor.style.background = 'yellow';
            break;
        case "s":
            keys.g.pressed = true;
            cursor.style.background = 'red';
            break;
        case "d":
            keys.b.pressed = true;
            cursor.style.background = 'blue';
            break;
    }
});

window.addEventListener("keyup", e => {
    let key = e.key;

    switch (key) {
        case "ArrowLeft":
        case "a":
            keys.a.pressed = false;
            break;
        case "ArrowRight":
        case "s":
            keys.d.pressed = false;
            break;
        case "ArrowUp":
        case "d":
            keys.w.pressed = false;
            break;
    }
});



//Funcao para as ocorrencias ficarem constante independente do poder de processamento
function animate(timeStamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    collisionCtx.clearRect(0, 0, canvas.width, canvas.height);
    let deltaTime = timeStamp - lastTime;
    lastTime = timeStamp
    timeToNextEnemy += deltaTime;
    if (timeToNextEnemy > enemyInterval) {
        enemies.push(new Ball());
        timeToNextEnemy = 0;
        enemies.sort(function (a, b) {
            return a.width - b.width; 
        })
    };
    drawScore();
    //Array literal and spread operator
    [...enemies, ...explosions].forEach(enemy => enemy.update(deltaTime));
    [...barriers, ...enemies, ...explosions].forEach(enemy => enemy.draw());
    enemies = enemies.filter(enemy => !enemy.markedForDeletion);
    explosions = explosions.filter(explosion => !explosion.markedForDeletion);
    if (!gameOver) requestAnimationFrame(animate);
    else drawGameOver();
}

animate(0);
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const collisionCanvas = document.getElementById('collisionCanvas');
const collisionCtx = collisionCanvas.getContext('2d');
collisionCanvas.width = window.innerWidth;
collisionCanvas.height = window.innerHeight;

ctx.font = '50px Impact';
let score = 0;
let gameOver = false; 

let timeToNextEnemy = 0;
let enemyInterval = 500;
let lastTime = 0;

let enemies = [];

class Raven {
    constructor() {
        this.spriteWidth = 271;
        this.spriteHeight = 192;
        this.sizeModifier = Math.random() * 0.6 + 0.4;
        this.width = this.spriteWidth * this.sizeModifier;
        this.height = this.spriteHeight * this.sizeModifier;
        this.x = canvas.width;
        this.y = Math.random() * (canvas.height - this.height);
        this.directionX = Math.random() * 5 + 3;
        this.directionY = Math.random() * 5 - 2.5;
        this.markedForDeletion = false;
        this.image = new Image();
        this.image.src = 'raven.png';
        this.frame = 0;
        this.maxFrame = 4;
        this.timeSinceFlap = 0;
        this.flapInterval = Math.random() * 50 + 50;
        this.randomColors = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];
        this.color = 'rgb(' + this.randomColors[0] + ',' + this.randomColors[1] + ',' + this.randomColors[2] + ')'; 
    }

    update(deltaTime) {
        if (this.y < 0 || this.y > canvas.height - this.height) {
            this.directionY = this.directionY * -1;
        }
        this.x -= this.directionX;
        this.y += this.directionY;
        if (this.x < 0 - this.width) this.markedForDeletion = true;
        this.timeSinceFlap += deltaTime;
        if (this.timeSinceFlap > this.flapInterval) {
            if (this.frame > this.maxFrame)
                this.frame = 0;
            else this.frame++;
            this.timeSinceFlap = 0;
        }
        if (this.x < 0 - this.width) gameOver = true;
    }

    draw() {
        collisionCtx.fillStyle = this.color; 
        collisionCtx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth,
            this.spriteHeight, this.x, this.y, this.width, this.height);
    }
}

let explosions = [];
class Explosion {
    constructor(x, y, size) {
        this.image = new Image();
        this.image.src = 'boom.png';
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
    ctx.fillText('Score: ' + score, 50, 75);
    ctx.fillStyle = 'white';
    ctx.fillText('Score: ' + score, 55, 80);
}

function drawGameOver() {
    ctx.textAlign = 'center';
    ctx.fillStyle = 'black';
    ctx.fillText('GAME OVER, your score is ' + score, canvas.width / 2, canvas.height / 2); 
    ctx.fillStyle = 'white';
    ctx.fillText('GAME OVER, your score is ' + score, canvas.width / 2 + 5, canvas.height / 2 + 5); 
}

window.addEventListener('click', function (clickEvent) {
    const detectPixelColor = collisionCtx.getImageData(clickEvent.x, clickEvent.y, 1, 1);
    const pixelColor = detectPixelColor.data;
    //Verifica colisao pela cor
    enemies.forEach(enemy => {
        if (enemy.randomColors[0] === pixelColor[0] && enemy.randomColors[1] === pixelColor[1] && enemy.randomColors[2] === pixelColor[2]) {
            enemy.markedForDeletion = true;
            score++;
            explosions.push(new Explosion(enemy.x, enemy.y, enemy.width));
        }
    })
})

//Funcao para as ocorrencias ficarem constante independente do poder de processamento
function animate(timeStamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    collisionCtx.clearRect(0, 0, canvas.width, canvas.height);
    let deltaTime = timeStamp - lastTime;
    lastTime = timeStamp
    timeToNextEnemy += deltaTime;
    if (timeToNextEnemy > enemyInterval) {
        enemies.push(new Raven());
        timeToNextEnemy = 0;
        enemies.sort(function (a, b) {
            return a.width - b.width; 
        })
    };
    drawScore();
    //Array literal and spread operator
    [...enemies, ...explosions].forEach(enemy => enemy.update(deltaTime));
    [...enemies, ...explosions].forEach(enemy => enemy.draw());
    enemies = enemies.filter(enemy => !enemy.markedForDeletion);
    explosions = explosions.filter(explosion => !explosion.markedForDeletion);
    if (!gameOver) requestAnimationFrame(animate);
    else drawGameOver();
}

animate(0);
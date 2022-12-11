import EnemyController from "./EnemyController.js";

const canvas = document.getElementById("game");
const contexto = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 600;

let cannonTop = new Image();
cannonTop.src = "./cannon.png";

const enemyController = new EnemyController(canvas);

function game() {
    //renderImages();
    enemyController.draw(contexto);
    //cannon.draw();

}

setInterval(game, 1000 / 60);



//cannonTop.onload = renderImages;

/*
let mousePos = null;
let angle = null;
let canShoot = true;

let imgCount = 1;
function renderImages() {
    if (--imgCount > 0) { return }
    createEnemies();
    animate();
}

function sortBallPos(x, y) {
    let rotatedAngle = angle;
    let dx = x - (cannon.x + 15);
    let dy = y - (cannon.y - 50);
    let distance = Math.sqrt(dx * dx + dy * dy);
    let originalAngle = Math.atan2(dy, dx);
    let newX = (cannon.x + 15) + distance * Math.cos(originalAngle + rotatedAngle);
    let newY = (cannon.y - 50) + distance * Math.sin(originalAngle + rotatedAngle);

    return {
        x: newX,
        y: newY
    }
}

function drawBorder() {
    contexto.fillStyle = "#666666";
    contexto.fillRect(0, 0, canvas.width, canvas.height);
    contexto.clearRect(20, 20, 560, 560);
}

class Cannon {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.topX = x - 20;
        this.topY = y - 95;
    }

    stand() {
        contexto.beginPath();
        contexto.moveTo(this.x, this.y);
        contexto.lineTo(this.x + 15, this.y - 50);
        contexto.lineTo(this.x + 30, this.y);
        contexto.stroke();
    }

    rotateTop() {
        if (mousePos) {
            angle = Math.atan2(mousePos.y - (this.y - 50), mousePos.x - (this.x + 15));
            contexto.translate((this.x + 15), (this.y - 50));
            contexto.rotate(angle); 
            contexto.translate(-(this.x + 15), -(this.y - 50));
        }
    }

    draw() {
        this.stand();
        contexto.save();
        this.rotateTop();
        contexto.drawImage(cannonTop, this.topX, this.topY, 100, 50);
    }
}

let cannon = new Cannon(80, 580);


class CannonBall {
    constructor(angle, x, y) {
        this.radius = 15;
        this.mass = this.radius;
        this.angle = angle;
        this.x = x;
        this.y = y;
        this.dx = Math.cos(angle) * 7;
        this.dy = Math.sin(angle) * 7;
        this.gravity = 0.05;
    }

    move() {
        if (this.y + this.gravity < 580) {
            this.dy += this.gravity;
        }

        this.x += this.dx;
        this.y += this.dy;
    }

    draw() {
        contexto.fillStyle = "black";
        contexto.beginPath();
        contexto.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        contexto.fill();
    }
}

class EnemyBall {
    constructor(angle, x, y) {
        this.radius = 15;
        this.mass = this.radius;
        this.angle = angle;
        this.x = x;
        this.y = y;
        this.dx = Math.cos(angle) * 7;
        this.dy = Math.sin(angle) * 7;
        this.gravity = 0.05;
    }

    move() {
        if (this.y + this.gravity < 580) {
            this.dy += this.gravity;
        }

        this.x += this.dx;
        this.y += this.dy;
    }

    draw() {
        contexto.fillStyle = "yellow";
        contexto.beginPath();
        contexto.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        contexto.fill();
    }
}

let cannonBalls = [];
let enemyBalls = [];

function collide(index) {
    let ball = cannonBalls[index];
    for (let j = index + 1; j < cannonBalls.length; j++) {
        let testBall = cannonBalls[j];
        if (ballHitBall(ball, testBall)) {
            collideBalls(ball, testBall);
        }
    }
}

function ballHitBall(ball1, ball2) {
    let collision = false;
    let dx = ball1.x - ball2.x;
    let dy = ball1.y - ball2.y;
    let distance = (dx * dx + dy * dy);
    if (distance <= (ball1.radius + ball2.radius) * (ball1.radius + ball2.radius)) {
        collision = true;
    }
    return collision;
}

function collideBalls(ball1, ball2) {
    let dx = ball2.x - ball1.x;
    let dy = ball2.y - ball1.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    let vCollisionNorm = { x: dx / distance, y: dy / distance };
    let vRelativeVelocity = { x: ball1.dx = ball2.dx, y: ball1.dy = ball2.dy };
    let speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;

}

function createEnemies() {
    for (let i = 0; i < 200; i+=50) {
        cannonBalls.push(
            new EnemyBall(angle, 35, 50 + i)
        );
    }
}

function animate() {
    requestAnimationFrame(animate);
    contexto.clearRect(0, 0, canvas.width, canvas.height);
    drawBorder();
    cannon.draw();
    contexto.restore();


    enemyBalls.forEach((ball) => {
        ball.move();
        ball.draw();
    })


    cannonBalls.forEach((ball, index) => {
        ball.move();
        collide(index);
        ball.draw();
    })
}

canvas.addEventListener("mousemove", e => {
    mousePos = {
        x: e.clientX - canvas.offsetLeft,
        y: e.clientY - canvas.offsetTop
    }
});

canvas.addEventListener("click", e => {
    if (angle < -2 || angle > 0.5) return;

    if (!canShoot) return;
    canShoot = false;

    let ballPos = sortBallPos(cannon.topX + 100, cannon.topY + 30);
    cannonBalls.push(
        new CannonBall(angle, ballPos.x, ballPos.y)
    );

    setTimeout(() => {
        canShoot = true;
    }, 1000);

});
*/

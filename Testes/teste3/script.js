

const ammo = document.querySelector('.ammo');
const cannon_body = document.querySelector('.cannon-body');
const cannon_head = document.querySelector('.cannon-head');

const ball1 = document.querySelector('.ball-1');
const ball2 = document.querySelector('.ball-2');


const shoot = (e) => {
    e = e || window.event;
    var letra = e.which || e.keyCode;
    if (letra == '32') {
        ammo.classList.add('shoot');
        setTimeout(() => {
            ammo.classList.remove('shoot');
        }, 500);
    } else if (letra == '38') {
        cannon_head.classList.add('rotate-up-head');
        cannon_body.classList.add('rotate-up-body');
        ammo.classList.add('shoot-curve');
        setTimeout(() => {
            cannon_head.classList.remove('rotate-up-head');
            cannon_body.classList.remove('rotate-up-body');
            ammo.classList.remove('shoot-curve');
        }, 2000);
    }
}


const loop = setInterval(() => {
    var ball1Position = +window.getComputedStyle(ball1).left.replace('px', '');
    var ball2Position = +window.getComputedStyle(ball2).left.replace('px', '');
    var ammoPosition = +window.getComputedStyle(ammo).left.replace('px', '');

    if (ammoPosition > ball1Position) {
        ball1.style.visibility = 'hidden';
    }
    if (ammoPosition > ball2Position) {
        ball2.style.visibility = 'hidden';
    }
        
}, 10);

document.addEventListener('keydown', shoot);


console.log('Meu joguinho');

const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');


const fundo = {
    desenha() {
        contexto.fillStyle = '#70c5ce';
        contexto.fillRect(0, 0, canvas.width, canvas.height);
    }
}


const chao = {
    spritePosX: 0,
    spritePosY: 1800,
    sprLargura: 785,
    sprAltura: 192,
    sprCanvaX: 0,
    sprCanvaY: canvas.height - 50,
    sprLargCanva: 800,
    sprAltCanva: 50,

    desenha() {
        contexto.drawImage(
            sprites,
            chao.spritePosX, chao.spritePosY,
            chao.sprLargura, chao.sprAltura,
            chao.sprCanvaX, chao.sprCanvaY,
            chao.sprLargCanva, chao.sprAltCanva
        );
    }
};

const heroi = {
    spritePosX: 106,
    spritePosY: 195,
    sprLargura: 367,
    sprAltura: 464,
    sprCanvaX: 20,
    sprCanvaY: 100,
    sprLargCanva: 50,
    sprAltCanva: 50,
    velocidade: 0,
    empuxo: 0.25,
    atualiza() {
        
        heroi.sprCanvaX = heroi.sprCanvaX + 1;
    },
    desenha() {
        contexto.drawImage(
            sprites,
            heroi.spritePosX, heroi.spritePosY,
            heroi.sprLargura, heroi.sprAltura,
            heroi.sprCanvaX, heroi.sprCanvaY,
            heroi.sprLargCanva, heroi.sprAltCanva
        );
    }
};

function loop() {

    fundo.desenha();
    chao.desenha();
    heroi.atualiza();
    heroi.desenha();



    requestAnimationFrame(loop);
};

loop();
console.log('Meu joguinho');

const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

/*
class Obstaculo {
    constructor (cor) {
        this.cor = cor;
        this.tamanho = this.geraRand(0, canvas.height);
        this.posicao = this.geraRand(0, canvas.height);
    }
    desenha() {
        contexto.fillStyle = 'red';
        //posX, posY, largura, altura
        contexto.fillRect((canvas.width-50), this.posicao, 30, this.tamanho);
        
    }
    geraRand(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    }

}*/

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

const obstaculo = {
    spritePosX: 937,
    spritePosY: 0,
    sprLargura: 188,
    sprAltura: 100,
    sprCanvaX: canvas.width,
    sprCanvaY: 100,
    sprLargCanva: 188,
    sprAltCanva: 100,
    velocidade: 0,
    empuxo: 0.25,
    atualiza() {
        obstaculo.sprCanvaX = obstaculo.sprCanvaX - 1;
    },
    desenha() {
        contexto.drawImage(
            sprites,
            obstaculo.spritePosX, obstaculo.spritePosY,
            obstaculo.sprLargura, obstaculo.sprAltura,
            obstaculo.sprCanvaX, obstaculo.sprCanvaY,
            obstaculo.sprLargCanva, obstaculo.sprAltCanva
        );
    }
};

function loop() {

    fundo.desenha();
    chao.desenha();
    heroi.atualiza();
    heroi.desenha();
    obstaculo.desenha();
    obstaculo.atualiza();
    
    //let obst1 = new Obstaculo('red',100,100);
    //obst1.desenha();


    requestAnimationFrame(loop);
};

loop();
const canvas = document.querySelector('canvas');

const ctx2d = canvas.getContext('2d');

const canvasWidth = 1024;
const canvasHeight = 576;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

let prevTime = 0;

animate();

function animate() {
    window.requestAnimationFrame(animate);

    handleControls();
    
    ctx2d.fillStyle = "black";
    ctx2d.fillRect(0, 0, canvasWidth, canvasHeight);

    //player.draw();
    player.update();
    //player2.update();
    
    let delta = (performance.now() - prevTime) / 1000;
    let fps = 1 / delta;

    prevTime = performance.now()
    //console.log(`FPS: ${fps}`);
}

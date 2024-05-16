let blocks = [
    "./img/blocks/grass.webp"
];
blocks = [
    "https://imghotlink.netlify.app/grass.webp"
];
let imgs = [];
let loadedImgCount = 0;
let guide = document.getElementById('guide');
blocks.forEach((element, index) => {
    imgs[index] = new Image();
    imgs[index].src = element;
    imgs[index].onload = imgLoaded;
});
function imgLoaded() {
    loadedImgCount += 1;
    if(loadedImgCount==blocks.length){
        console.log("Image was loaded");
        setInterval(drawImage, 1000/60);
    }
}
function drawImage(params) {
    let canvas = document.createElement('canvas');
    let ratio = [20, 9]; //화면 비율 20:9
    /** 브라우저 창의 내부 사이즈 */
    let clientSize = [window.innerWidth, window.innerHeight];
    /** 현재 사용되는 화면 사이즈 */
    let screenSize = [window.screen.width, window.screen.height];
    if(clientSize[0]<clientSize[1]){
        //세로 비율 맞추는 용도
        clientSize = [clientSize[1], clientSize[0]];
        screenSize = [screenSize[1], screenSize[0]];
    }
    let canvasSize = [clientSize[0], clientSize[0]/ratio[0]*ratio[1]];
    if(canvasSize[1] > clientSize[1]){
        canvasSize = [clientSize[1]/ratio[1]*ratio[0], clientSize[1]];
    }
    canvas.width = canvasSize[0];
    canvas.height = canvasSize[1];
    canvas.style.backgroundColor = 'white';
    let screen = document.getElementById('screen');
    if (canvas.getContext) {
        var ctx = canvas.getContext("2d");
        if(clientSize[1] !== screenSize[1]){
            ctx.fillStyle = 'red';
            // guideDraw('fullscreen');
        }
        ctx.fillRect(canvasSize[0]/10, canvasSize[1]/2+canvasSize[0]/10*0.5, canvasSize[0]/10, canvasSize[0]/10);
        ctx.fillRect(canvasSize[0]/10, canvasSize[1]/2-canvasSize[0]/10*1.5, canvasSize[0]/10, canvasSize[0]/10);
        screen.innerHTML = '';
        screen.appendChild(canvas);
    } else {
        // canvas-unsupported code here
        screen.innerHTML = "지원되지 않는 환경입니다.<p style='font-size: 5vh'>다른 브라우저를 사용해 주세요.<br>다른 브라우저를 사용했음에도 이 화면이 계속 나타나는 경우, 고객센터로 접수 부탁드립니다.</p>"
    }
}

function guideDraw(condition) {
    guide.style.display = 'block';
    switch (condition) {
        case 'fullscreen':
            
            break;
    
        default:
            break;
    }
    
}

const fullscreen = element => {
    if (element.requestFullscreen) return element.requestFullscreen();
    if (element.webkitRequestFullscreen) return element.webkitRequestFullscreen();
    if (element.mozRequestFullScreen) return element.mozRequestFullScreen();
    if (element.msRequestFullscreen) return element.msRequestFullscreen();
}

const exitFullScreen = () => {
    if (document.exitFullscreen) return document.exitFullscreen();
    if (document.webkitCancelFullscreen) return document.webkitCancelFullscreen();
    if (document.mozCancelFullScreen) return document.mozCancelFullScreen();
    if (document.msExitFullscreen) return document.msExitFullscreen();
}
let blocks = [
    "./img/blocks/grass.webp"
];
blocks = [
    "https://imghotlink.netlify.app/grass.webp"
];
let imgs = [];
let loadedImgCount = 0;
let guide = document.getElementById('guide');
let guideClickEvent;
/** 브라우저 창의 내부 사이즈 */
let innerSize = [window.innerWidth, window.innerHeight];
/** 브라우저 창의 전체 사이즈 */
let outerSize = [window.outerWidth, window.outerHeight];
/** 클라이언트가 사용하는 화면 전체 사이즈 */
let screenSize = [window.screen.width, window.screen.height];
let canvasSize = [0, 0];
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
    innerSize = [window.innerWidth, window.innerHeight];
    screenSize = [window.screen.width, window.screen.height];
    // if(window.outerWidth-innerSize[0]>window.outerWidth/5) {
    //     console.log(1);
    //     setTimeout(()=>{
    //         if(window.outerWidth-innerSize[0]>window.outerWidth/5)
    //         window.close()
    //     }, 500);
    // }
    if(innerSize[0]<innerSize[1]){
        //세로 비율 맞추는 용도
        innerSize = [innerSize[1], innerSize[0]];
        screenSize = [screenSize[1], screenSize[0]];
    }
    canvasSize = [innerSize[0], innerSize[0]/ratio[0]*ratio[1]];
    if(canvasSize[1] > innerSize[1]){
        canvasSize = [innerSize[1]/ratio[1]*ratio[0], innerSize[1]];
    }
    canvas.width = canvasSize[0];
    canvas.height = canvasSize[1];
    canvas.style.backgroundColor = 'white';
    let screen = document.getElementById('screen');
    if (canvas.getContext) {
        var ctx = canvas.getContext("2d");
        if(innerSize[1] !== screenSize[1]){
            ctx.fillStyle = 'red';
            guideDraw('fullscreen');
        }else{
            guide.style.display = 'none';
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
    switch (condition) {
        case 'fullscreen':
            guide.style.fontSize = `${canvasSize[0]/100*3}px`;
            document.querySelector('#guide > *:nth-child(2)').style.marginTop = `${canvasSize[1]/100*10}px`;
            if(guideClickEvent!=='fullscreen'){
                guideClickEvent = 'fullscreen';
                document.querySelector('#guide > *:nth-child(1)').textContent = '아래 버튼을 눌러 전체화면으로 전환하세요.';
                document.querySelector('#guide > *:nth-child(2)').textContent = '전체 화면';
                document.querySelector('#guide > *:nth-child(2)').onclick = () => {
                    fullscreen();
                    console.log('fullscreen', innerSize[0], screenSize[0]);
                };
            }
            break;
    
        default:
            break;
    }
    guide.style.display = 'flex';
    
}

function fullscreen(element = document.documentElement) {
    if (element.requestFullscreen) return element.requestFullscreen();
    if (element.webkitRequestFullscreen) return element.webkitRequestFullscreen();
    if (element.mozRequestFullScreen) return element.mozRequestFullScreen();
    if (element.msRequestFullscreen) return element.msRequestFullscreen();
}

function exitFullScreen() {
    if (document.exitFullscreen) return document.exitFullscreen();
    if (document.webkitCancelFullscreen) return document.webkitCancelFullscreen();
    if (document.mozCancelFullScreen) return document.mozCancelFullScreen();
    if (document.msExitFullscreen) return document.msExitFullscreen();
}
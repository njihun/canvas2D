//Add type(module) in index.html
//js import activity
//import func 주석처리
// import { controllerPosition } from "./directionKey.js";
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
let controllerSize = 30;
blocks.forEach((element, index) => {
    imgs[index] = new Image();
    imgs[index].src = element;
    imgs[index].onload = imgLoaded;
});
function imgLoaded() {
    loadedImgCount += 1;
    if (loadedImgCount == blocks.length) {
        console.log("Image was loaded");
        setInterval(drawImage, 1000 / 60);
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
    if (innerSize[0] < innerSize[1]) {
        //세로 비율 맞추는 용도
        innerSize = [innerSize[1], innerSize[0]];
        outerSize = [outerSize[1], outerSize[0]];
        screenSize = [screenSize[1], screenSize[0]];
    }
    canvasSize = [innerSize[0], innerSize[0] / ratio[0] * ratio[1]];
    if (canvasSize[1] > innerSize[1]) {
        canvasSize = [innerSize[1] / ratio[1] * ratio[0], innerSize[1]];
    }
    canvas.width = canvasSize[0];
    canvas.height = canvasSize[1];
    canvas.style.backgroundColor = 'white';
    let screen = document.querySelector("#screen > div");
    screen.style.width = canvasSize[0] + 'px';
    screen.style.height = canvasSize[1] + 'px';
    screen = document.querySelector("#screen > div > div:nth-child(1)");
    if (canvas.getContext) {
        var ctx = canvas.getContext("2d");
        if (!isFullscreen()) {
            ctx.fillStyle = 'red';
            guideDraw('fullscreen');
        } else {
            guide.style.display = 'none';
        }
        ctx.fillRect(canvasSize[0] / 10, canvasSize[1] / 2 + canvasSize[0] / 10 * 0.5, canvasSize[0] / 10, canvasSize[0] / 10);
        ctx.fillRect(canvasSize[0] / 10, canvasSize[1] / 2 - canvasSize[0] / 10 * 1.5, canvasSize[0] / 10, canvasSize[0] / 10);
        controllerPosition(canvasSize, ctx, controllerSize);
        screen.innerHTML = '';
        screen.appendChild(canvas);
    } else {
        // canvas-unsupported code here
        screen.innerHTML = `지원되지 않는 환경입니다.<p style='font-size: ${innerSize[1] / 20}px'>다른 브라우저를 사용해 주세요.<br>다른 브라우저를 사용했음에도 이 화면이 계속 나타나는 경우, 고객센터로 접수 부탁드립니다.</p>`;
    }
}

function guideDraw(condition) {
    switch (condition) {
        case 'fullscreen':
            guide.style.fontSize = `${canvasSize[0] / 100 * 3}px`;
            document.querySelector('#guide > *:nth-child(2)').style.marginTop = `${canvasSize[1] / 100 * 10}px`;
            if (guideClickEvent !== 'fullscreen') {
                guideClickEvent = 'fullscreen';
                document.querySelector('#guide > *:nth-child(1)').textContent = '아래 버튼을 눌러 전체화면으로 전환하세요.';
                document.querySelector('#guide > *:nth-child(2)').textContent = '전체 화면';
                document.querySelector('#guide > *:nth-child(2)').addEventListener('click', () => {
                    guideClickEvent = null;
                    fullscreen();
                    console.log('fullscreen', innerSize[0], screenSize[0]);
                }, { once: true });
            }
            break;

        default:
            break;
    }
    guide.style.display = 'flex';

}

const touchArea = document.querySelector("#screen > div > #ui");

touchArea.addEventListener('touchstart', handleTouch);
touchArea.addEventListener('touchmove', handleTouch);
touchArea.addEventListener('touchend', handleTouch);
touchArea.addEventListener('touchcancel', handleTouch);

let controllerId = null;
let controllerX = [0, 0];
let controllerY = [0, 0];
function handleTouch(event) {
    let reverse = false;
    // event.preventDefault();
    const touches = event.changedTouches; // 현재 활성화된 모든 터치 지점
    const touchInfo = Array.from(touches).map(touch => {
        const rect = touchArea.getBoundingClientRect();
        if (window.innerWidth < window.innerHeight) {
            //세로 비율 맞추는 용도
            reverse = true;
            return [touch.clientY - rect.top, touch.clientX - rect.left, touch.identifier];
        }
        return [touch.clientX - rect.left, touch.clientY - rect.top, touch.identifier];
    }).forEach((element, i) => {
        switch (event.type) {
            case 'touchstart':
                if (controllerId == null) {
                    //컨트롤러가 안 정해져있을 때
                    if (reverse && element[0] < canvasSize[1] / 4 * 3 && element[1] < canvasSize[1] / 2
                        || !reverse && element[0] < canvasSize[1] / 4 * 3 && element[1] > canvasSize[1] / 2) {
                        //컨트롤러 판정 범위에 들어왔을 때
                        controllerId = element[2];
                        controllerX = [element[0], element[0]];
                        controllerY = [element[1], element[1]];
                    }
                }
                break;
            case 'touchmove':
                if (controllerId == element[2]) {
                    //컨트롤러 id 위치 따로 저장해두고 계산할 것
                    controllerX[1] = element[0];
                    controllerY[1] = element[1];
                }
                break;
            case 'touchend':
            case 'touchcancel':
                if (controllerId == element[2]) {
                    controllerId = null;
                    controllerX = [0, 0];
                    controllerY = [0, 0];
                }
                break;
            default:
                //end, cancel
                break;
        }
    });
}

function isFullscreen() {
    return document.fullscreenElement || /* Standard syntax */
        document.webkitFullscreenElement || /* Safari and Opera syntax */
        document.msFullscreenElement; /* IE11 syntax */
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

function controllerPosition(canvasSize, ctx, originSize = controllerSize, marginBottom = 15, marginLeft = 20) {
    let size = canvasSize[1] / 100 * originSize / 2;
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.strokeStyle = 'red';
    // 원 그리기 시작
    ctx.beginPath();
    // (x, y, 반지름, 시작 각도, 끝나는 각도, 시계 반대 방향으로 그리기?)
    ctx.arc((size) + canvasSize[1] / 100 * Math.min(marginLeft, 50), (canvasSize[1] - size) - canvasSize[1] / 100 * Math.min(marginBottom, 50 - originSize / 2), size, 0, Math.PI * 2, false);
    // 색 채우기
    ctx.fill();
    // 윤곽선 그리기
    ctx.stroke();

    ctx.fillStyle = "red";
    ctx.beginPath();
    const joystickSize = originSize / 3 / 2;
    const r = originSize;
    let change = [controllerX[1] - controllerX[0], controllerY[1] - controllerY[0]];
    function findClosestPointOnCircle(vectorX, vectorY, radius) {
        // 벡터의 길이를 계산합니다.
        let distance = Math.sqrt(vectorX * vectorX + vectorY * vectorY);
        
        // 벡터를 단위 벡터로 변환합니다.
        let unitVectorX = vectorX / distance;
        let unitVectorY = vectorY / distance;
        
        // 단위 벡터에 반지름을 곱하여 원 위의 점을 구합니다.
        let closestPointX = unitVectorX * radius;
        let closestPointY = unitVectorY * radius;
        
        if(distance>radius){
            return { x: closestPointX, y: closestPointY };
        }
        return {
            x: Math.max(-canvasSize[1]/100*originSize / 2, Math.min(change[0], Math.min(Math.abs(change[0]), canvasSize[1]/100*originSize / 2))),
            y: Math.max(-canvasSize[1]/100*originSize / 2, Math.min(change[1], Math.min(Math.abs(change[1]), canvasSize[1]/100*originSize / 2)))
        }
    }
    let radius = canvasSize[1]/100*originSize/2;
    
    let closestPoint = findClosestPointOnCircle(change[0], change[1], radius);
    [controllerPosX, controllerPosY] = [closestPoint.x, closestPoint.y];
    if (window.innerWidth < window.innerHeight)
        // 세로 비율 맞추는 용도
        [controllerPosX, controllerPosY] = [controllerPosX, -controllerPosY];
    ctx.arc((size) + canvasSize[1] / 100 * Math.min(marginLeft, 50) + controllerPosX, (canvasSize[1] - size) - canvasSize[1] / 100 * Math.min(marginBottom, 50 - originSize / 2) + controllerPosY, canvasSize[1]/100*joystickSize, 0, Math.PI * 2, false);
    ctx.fill();
}

import target from "./target.js"
import manifest from "https://pauldoazan.github.io/hidden-in-plain-sight/assets/manifest.json" assert { type: 'json' };
import zombie from "./zombie.js"
import { shuffleArray, getDistanceBetweenTwoPoints } from "./utils.js";

let stage, loader;
let arrKeydown = [];
let bots = [];
let numZombies = 10;
let keysAllowed = ['a', 's', 'd', 'w', 'f', 't', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Shift', 'Enter']
let tg1, tg2, targetsContainer, zombiesContainer, bg1, bg2;
let targetSpeed = 4;
let zombie1, zombie2;

window.addEventListener('load', init)

function init() {
    let canvas = document.getElementById("demoCanvas");
    stage = new createjs.Stage(canvas);
    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.addEventListener("tick", () => {
        stage.update();
    });

    loader = new createjs.LoadQueue(false);
    loader.addEventListener("complete", handleComplete);
    loader.loadManifest(manifest, true, "../assets/");

    setGame();
}

function handleComplete() {
    for (let index = 0; index < numZombies; index++) {
        bots.push(zombie(zombiesContainer, loader));
    }

    shuffleArray(bots);
    zombie1 = bots[0];
    zombie2 = bots[1];
    zombie1.isPlayer = zombie2.isPlayer = true

    bg1 = createBackground(bg1, 'bg1');
    bg2 = createBackground(bg2, 'bg2');
}

function createBackground(container, str) {
    let bmp = new createjs.Bitmap(loader.getResult(str));
    if (str === 'bg2') bmp.y = 324
    container.addChild(bmp)
}

function setGame() {
    tg1 = target(500, 200, 'yellow')
    tg2 = target(650, 240, 'blue')

    zombiesContainer = new createjs.Container()
    targetsContainer = new createjs.Container()
    bg1 = new createjs.Container();
    bg2 = new createjs.Container();
    targetsContainer.addChild(tg1, tg2)

    stage.addChild(bg1, zombiesContainer, bg2, targetsContainer);

    window.addEventListener('keydown', onKeydown)
    window.addEventListener('keyup', onKeyup)
    stage.on('tick', moveTargets)

    return stage;
}

function moveTargets() {
    if (arrKeydown.length === 0) return;
    arrKeydown.forEach((key) => {
        if (key === 'ArrowUp') tg1.y -= targetSpeed
        if (key === 'ArrowLeft') tg1.x -= targetSpeed
        if (key === 'ArrowRight') tg1.x += targetSpeed
        if (key === 'ArrowDown') tg1.y += targetSpeed

        if (key === 'w') tg2.y -= targetSpeed
        if (key === 'a') tg2.x -= targetSpeed
        if (key === 'd') tg2.x += targetSpeed
        if (key === 's') tg2.y += targetSpeed

        if (key === 'Enter') zombie1.x += 0.5;
        if (key === 't') zombie2.x += 0.5;
    })
}

function onKeyup(e) {
    e.preventDefault();
    if (arrKeydown.includes(e.key)) {
        arrKeydown = arrKeydown.filter((item) => {
            return item !== e.key
        })
    }
    if (e.key === 'Enter') zombie1.animate(1)
    if (e.key === 't') zombie2.animate(1)
}

function onKeydown(e) {
    e.preventDefault()
    if (keysAllowed.includes(e.key) && !arrKeydown.includes(e.key)) {
        arrKeydown.push(e.key);
    }
    if (e.key === 'Enter') zombie1.animate(0)
    if (e.key === 't') zombie2.animate(0)

    if (e.key === 'Shift') fire(tg1)
    if (e.key === 'f') fire(tg2)
}

function fire(tg) {
    let target;
    let targets = bots.filter((bot) => getDistanceBetweenTwoPoints(tg, bot) < tg.radius)
    targets.sort((a, b) => getDistanceBetweenTwoPoints(tg, a) - getDistanceBetweenTwoPoints(tg, b))
    if (!targets.length) return
    target = targets[0];

    target.animate(2);
    target.removeEventListener('tick', target.tickHandler)
}
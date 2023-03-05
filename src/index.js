const colors = ['#063c77', '#f19648', '#f5d259', '#d84f35']
let stage, manifest, loader;
let arrKeydown = [];
let keysAllowed = ['a', 's', 'd', 'w', 'f', 't', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Shift', 'Enter']
let tg1, tg2, targetsContainer, zombiesContainer, bg1, bg2;
let targetSpeed = 4;
let zombie1, zombie2;
let infos = [
    {
        type: 'man',
        walk: 8,
        idle: 8,
        die: 5
    },
    {
        type: 'woman',
        walk: 7,
        idle: 5,
        die: 5
    },
]

window.addEventListener('load', init)

function init() {
    let canvas = document.getElementById("demoCanvas");
    stage = new createjs.Stage(canvas);

    setGame();

    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.addEventListener("tick", () => {
        stage.update();
    });

    manifest = [
        { src: "man/Walk.png", id: "man_walk" },
        { src: "man/Idle.png", id: "man_idle" },
        { src: "man/die.png", id: "man_die" },
        { src: "woman/Walk.png", id: "woman_walk" },
        { src: "woman/Idle.png", id: "woman_idle" },
        { src: "woman/die.png", id: "woman_die" },
        { src: "background_1.jpg", id: "bg1" },
        { src: "background_2.jpg", id: "bg2" },
    ];

    loader = new createjs.LoadQueue(false);
    loader.addEventListener("complete", handleComplete);
    loader.loadManifest(manifest, true, "../assets/");
}

function handleComplete() {
    zombie1 = createZombie('man')
    zombie2 = createZombie('woman')

    bg1 = createBackground(bg1, 'bg1');
    bg2 = createBackground(bg2, 'bg2');
}

function createBackground(container, str) {
    let bmp = new createjs.Bitmap(loader.getResult(str));
    if (str === 'bg2') bmp.y = 324
    container.addChild(bmp)
}

function createTarget(x, y, color) {
    let container = new createjs.Container()
    let gr = new createjs.Graphics()
    let fireTarget = new createjs.Shape(gr)

    gr.setStrokeStyle(5);
    gr.beginStroke(color);
    gr.drawCircle(0, 0, 50);

    container.x = x;
    container.y = y;

    container.addChild(fireTarget);

    return container;
}

function setGame() {
    tg1 = createTarget(150, 200, 'red')
    tg2 = createTarget(350, 300, 'blue')

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

// index 0 -> walk ; 1 -> idle; 2 -> die
function animateZombie(currentZombie, index) {
    currentZombie.animations.forEach((animation, i) => {
        animation.visible = i === index
    })
}

function onKeyup(e) {
    e.preventDefault();
    if (arrKeydown.includes(e.key)) {
        arrKeydown = arrKeydown.filter((item) => {
            return item !== e.key
        })
    }
    if (e.key === 'Enter') animateZombie(zombie1, 1)
    if (e.key === 't') animateZombie(zombie2, 1)
}

function onKeydown(e) {
    e.preventDefault()
    if (keysAllowed.includes(e.key) && !arrKeydown.includes(e.key)) {
        arrKeydown.push(e.key);
    }
    if (e.key === 'Enter') animateZombie(zombie1, 0)
    if (e.key === 't') animateZombie(zombie2, 0)
}

function createZombie(type) {
    let info = infos.filter(info => info.type === type)[0]
    let container = new createjs.Container();

    let maxWalk = info.walk - 1;
    let spriteSheet1 = new createjs.SpriteSheet({
        framerate: 60,
        "images": [loader.getResult(`${type}_walk`)],
        "frames": { "regX": 48, "height": 96, "count": info.walk, "regY": 0, "width": 96 },
        "animations": {
            "walk": [0, maxWalk, "walk", 0.1],
        }
    });

    let maxIdle = info.idle - 1;
    let spriteSheet2 = new createjs.SpriteSheet({
        framerate: 60,
        "images": [loader.getResult(`${type}_idle`)],
        "frames": { "regX": 48, "height": 96, "count": info.idle, "regY": 0, "width": 96 },
        "animations": {
            "idle": [0, maxIdle, "idle", 0.1],
        }
    });

    let maxDie = info.die - 1;
    let spriteSheet3 = new createjs.SpriteSheet({
        framerate: 60,
        "images": [loader.getResult(`${type}_die`)],
        "frames": { "regX": 0, "height": 96, "count": info.die, "regY": 0, "width": 96 },
        "animations": {
            "die": [0, maxDie, "die", 0.1],
            "die": [4],
        }
    });
    let walk = new createjs.Sprite(spriteSheet1, "walk");
    let idle = new createjs.Sprite(spriteSheet2, "idle");
    let die = new createjs.Sprite(spriteSheet3, "die");

    walk.visible = false;
    die.visible = false;

    container.addChild(walk, idle, die)
    container.animations = [walk, idle, die];
    zombiesContainer.addChild(container);
    container.x = 100
    container.y = zombiesContainer.numChildren * 100;

    return container;
}


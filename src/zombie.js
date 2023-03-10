import spriteSheetInfos from "https://pauldoazan.github.io/hidden-in-plain-sight/assets/spriteSheetInfos.json" assert { type: 'json' };
import { getRandomIntInclusive } from "./utils.js";

let types = ["wild", "woman", "man"]
let walkSpeed = 0.3

export default function zombie(parentContainer, loader) {
    let indexType = getRandomIntInclusive(0, 2);
    let type = types[indexType];
    let info = spriteSheetInfos.filter(info => info.type === type)[0]
    let container = new createjs.Container();

    let maxWalk = info.walk - 1;
    let spriteSheet1 = new createjs.SpriteSheet({
        framerate: 60,
        "images": [loader.getResult(`${type}_walk`)],
        "frames": { "regX": 48, "height": 96, "count": info.walk, "regY": 48, "width": 96 },
        "animations": {
            "walk": [0, maxWalk, "walk", 0.1],
        }
    });

    let maxIdle = info.idle - 1;
    let spriteSheet2 = new createjs.SpriteSheet({
        framerate: 60,
        "images": [loader.getResult(`${type}_idle`)],
        "frames": { "regX": 48, "height": 96, "count": info.idle, "regY": 48, "width": 96 },
        "animations": {
            "idle": [0, maxIdle, "idle", 0.1],
        }
    });

    let maxDie = info.die - 1;
    let spriteSheet3 = new createjs.SpriteSheet({
        framerate: 60,
        "images": [loader.getResult(`${type}_die`)],
        "frames": { "regX": 48, "height": 96, "count": info.die, "regY": 48, "width": 96 },
        "animations": {
            die: [0, maxDie, "stop", 0.1],
            stop: maxDie,
        }
    });
    let walk = new createjs.Sprite(spriteSheet1, "walk");
    let idle = new createjs.Sprite(spriteSheet2, "idle");
    let die = new createjs.Sprite(spriteSheet3, "die");

    walk.visible = false;
    die.visible = false;
    walk.stop()
    die.stop()

    container.addChild(walk, idle, die)
    container.animations = [walk, idle, die];
    container.canMove = false;
    container.x = 50 + getRandomIntInclusive(20, 60)
    container.y = 88 + (parentContainer.numChildren) * 20 + getRandomIntInclusive(3, 25);
    container.animate = animate;

    parentContainer.addChild(container)

    let minTick = 40
    let maxTick = 200
    let countTick = getRandomIntInclusive(minTick, maxTick);
    container.tickHandler = container.on('tick', (e) => {
        countTick--;
        if (countTick <= 0) {
            container.canMove = !container.canMove;
            countTick = getRandomIntInclusive(minTick, maxTick);
            if (container.canMove) {
                if (!container.isPlayer) {
                    e.currentTarget.animate(0)
                    e.currentTarget.x += walkSpeed;
                }
            } else {
                e.currentTarget.animate(1)
            }
        }

        if (container.canMove && !container.isPlayer) e.currentTarget.x += walkSpeed;
    })

    return container;
}

// index 0 -> walk ; 1 -> idle; 2 -> die
function animate(index) {
    this.animations.forEach((animation, i) => {
        animation.visible = i === index
        if (i === index) {
            animation.visible = true
            animation.play();
        } else {
            animation.visible = false
        }

    })
}
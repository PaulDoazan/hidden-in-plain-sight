export default function fireShot(parentContainer, loader) {
    let container = new createjs.Container();

    let spriteSheet = new createjs.SpriteSheet({
        framerate: 60,
        "images": [loader.getResult("bloodShot")],
        "frames": { "regX": 140, "height": 215, "count": 16, "regY": 80, "width": 215 },
        "animations": {
            "blood": [0, 16, "end", 0.7],
            "end": 16
        }
    });

    let blood = new createjs.Sprite(spriteSheet, "blood");

    blood.scaleX = blood.scaleY = 0.5;
    container.addChild(blood)
    parentContainer.addChild(container)

    return container;
}
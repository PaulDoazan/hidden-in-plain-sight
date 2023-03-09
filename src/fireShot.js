export default function fireShot(parentContainer, loader) {
    let container = new createjs.Container();

    let result = loader.getResult("fireShot")
    console.log(result)
    let spriteSheet = new createjs.SpriteSheet({
        framerate: 60,
        "images": [loader.getResult("fireShot")],
        "frames": { "regX": 48, "height": 96, "count": 20, "regY": 48, "width": 96 },
        "animations": {
            "fire": [0, 19, "end", 0.1],
            "end": 19
        }
    });

    let fire = new createjs.Sprite(spriteSheet, "fire");

    container.addChild(fire)
    parentContainer.addChild(container)

    return container;
}
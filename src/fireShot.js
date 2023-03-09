export default function fireShot(parentContainer, loader) {
    let container = new createjs.Container();

    let result = loader.getResult("fireShot")
    console.log(result)
    let spriteSheet = new createjs.SpriteSheet({
        framerate: 60,
        "images": [loader.getResult("fireShot")],
        "frames": { "regX": 32, "height": 64, "count": 16, "regY": 32, "width": 64 },
        "animations": {
            "fire": [0, 16, "end"],
            "end": 16
        }
    });

    let fire = new createjs.Sprite(spriteSheet, "fire");

    fire.scaleX = fire.scaleY = 0.5;
    container.addChild(fire)
    parentContainer.addChild(container)

    return container;
}
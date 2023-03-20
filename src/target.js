const radius = 20;
const bigDashLength = radius;
const smallDashLength = 3;

export default function target(x, y, color) {
    let container = new createjs.Container()

    let outterCircle = drawCircle(color, radius)
    let innerCircle = drawCircle(color, radius * 0.75)
    let dashes = drawDashes(color);

    innerCircle.alpha = 0.5

    container.x = x;
    container.y = y;

    container.addChild(outterCircle, innerCircle, dashes);
    container.radius = radius;

    return container;
}

function drawDashes(col) {
    let sh = new createjs.Shape()
    sh.graphics.beginStroke(col);
    sh.graphics.setStrokeStyle(2);
    sh.graphics.moveTo(0, -radius - bigDashLength / 2)
    sh.graphics.lineTo(0, -radius + bigDashLength / 2)
    sh.graphics.moveTo(radius - bigDashLength / 2, 0)
    sh.graphics.lineTo(radius + bigDashLength / 2, 0)
    sh.graphics.moveTo(0, radius - bigDashLength / 2)
    sh.graphics.lineTo(0, radius + bigDashLength / 2)
    sh.graphics.moveTo(-radius - bigDashLength / 2, 0)
    sh.graphics.lineTo(-radius + bigDashLength / 2, 0)

    sh.graphics.moveTo(0, -radius / 6 - smallDashLength / 2)
    sh.graphics.lineTo(0, -radius / 6 + smallDashLength / 2)
    sh.graphics.moveTo(radius / 6 - smallDashLength / 2, 0)
    sh.graphics.lineTo(radius / 6 + smallDashLength / 2, 0)
    sh.graphics.moveTo(0, radius / 6 - smallDashLength / 2)
    sh.graphics.lineTo(0, radius / 6 + smallDashLength / 2)
    sh.graphics.moveTo(-radius / 6 - smallDashLength / 2, 0)
    sh.graphics.lineTo(-radius / 6 + smallDashLength / 2, 0)

    return sh
}

function drawCircle(col, rad) {
    let sh = new createjs.Shape()
    sh.graphics.setStrokeStyle(2);
    sh.graphics.beginStroke(col);
    sh.graphics.drawCircle(0, 0, rad);

    return sh;
}
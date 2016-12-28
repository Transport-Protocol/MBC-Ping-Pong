var Wall = require('./Wall.js');

var fieldNodes = {
    topWall: {from: {x: 0, y: 64}, to: {x: 640, y: 64}},
    lowerWall: {from: {x: 0, y: 440}, to: {x: 640, y: 440}},
    leftWall: {from: {x: 0, y: 64}, to: {x: 0, y: 440}},
    rightWall: {from: {x: 640, y: 64}, to: {x: 640, y: 440}}
}
var buildField = function (game, wallSprite) {
    var walls = game.add.group();

    // Obere Begrenzung
    walls.add(new Wall(game, wallSprite, fieldNodes.topWall.from, fieldNodes.topWall.to));
    walls.add(new Wall(game, wallSprite, fieldNodes.lowerWall.from, fieldNodes.lowerWall.to));
    walls.add(new Wall(game, wallSprite, fieldNodes.leftWall.from, fieldNodes.leftWall.to));
    walls.add(new Wall(game, wallSprite, fieldNodes.rightWall.from, fieldNodes.rightWall.to));
    return walls;
    // Untere Begrenzung
}

module.exports.buildField = buildField;
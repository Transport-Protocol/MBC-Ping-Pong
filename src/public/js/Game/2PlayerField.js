var Wall = require('./Wall.js');



var fieldNodes = {
  upperWall: {from: {x: 0, y: 64}, to: {x: 640, y: 64}},
  rightWall: {from: {x: 640, y: 64}, to: {x: 640, y: 440}},
  lowerWall: {from: {x: 640, y: 440}, to: {x: 0, y: 440}},
  leftWall: {from: {x: 0, y: 440}, to: {x: 0, y: 64}},


  upperEnd: {from: {x: 0, y: 0}, to: {x: 640, y: 64}},
  lowerEnd: {from: {x: 0, y: 440}, to: {x: 640, y: 480}}
};

var playerInfoPack = [];

var buildField = function (game, wallSprite) {
  //create Score fpr Player 0
  var style0 = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "right", boundsAlignV: "middle" };
  var scorePlayer0 = game.add.text(0, 0, "00", style0);
  scorePlayer0.setTextBounds(0, 0, (game.width / 2) - 20, 64)

  //Create seperator
  var styleSeperator = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
  var seperator = game.add.text(0, 0, ":", styleSeperator);
  seperator.setTextBounds((game.width / 2) - 20, 0, 40, 64)

  var style1 = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "left", boundsAlignV: "middle" };
  var scorePlayer1 = game.add.text(0, 0, "00", style1);
  scorePlayer1.setTextBounds((game.width / 2) + 20, 0, (game.width / 2) - 20, 64)
  var walls = game.add.group();

  // Sichtbare Wände
  var upperWall = createWall(game, wallSprite, fieldNodes.upperWall);
  var lowerWall = createWall(game, wallSprite, fieldNodes.lowerWall);
  var rightWall = createWall(game, wallSprite, fieldNodes.rightWall);
  var leftWall = createWall(game, wallSprite, fieldNodes.leftWall)
  walls.add(upperWall);
  walls.add(lowerWall);
  walls.add(rightWall);
  walls.add(leftWall);

  playerInfoPack = [
    {"upperWall" : upperWall, "lowerWall": lowerWall, "pointWall": leftWall},
    {"upperWall" : upperWall, "lowerWall": lowerWall, "pointWall": rightWall}
  ];

  // Unsichtbare Begrenzung, gegen Tunneling
  walls.add(invisibleWall(game, fieldNodes.upperEnd));
  walls.add(invisibleWall(game, fieldNodes.lowerEnd));
  return walls;
};

function getPlayerInfoPack(playerNumber){
  return playerInfoPack[playerNumber];
};

function createWall(game, sprite, positions) {
  var wall = new Wall(game, sprite, positions.from, positions.to);
  return wall;
}

function invisibleWall(game, n1) {
  var x = n1.from.x + Phaser.Math.difference(n1.from.x, n1.to.x) / 2;
  var y = n1.from.y + Phaser.Math.difference(n1.from.y, n1.to.y) / 2;
  var wall = game.add.sprite(x, y);

  game.physics.p2.enable(wall, game.properties.debug);
  wall.body.static = true;
  wall.body.setRectangle(Phaser.Math.difference(n1.from.x, n1.to.x), Phaser.Math.difference(n1.from.y, n1.to.y));
  return wall;
}

module.exports.buildField = buildField;
module.exports.getPlayerInfoPack = getPlayerInfoPack;

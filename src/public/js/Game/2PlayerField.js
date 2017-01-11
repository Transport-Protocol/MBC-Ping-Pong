var Wall = require('./Wall.js');



var fieldNodes = {
  upperWall: {from: {x: 0, y: 64}, to: {x: 640, y: 64}},
  rightWall: {from: {x: 640, y: 64}, to: {x: 640, y: 440}},
  lowerWall: {from: {x: 640, y: 440}, to: {x: 0, y: 440}},
  leftWall: {from: {x: 0, y: 440}, to: {x: 0, y: 64}}
};

var playerInfoPack = [];

var buildField = function (game, wallSprite) {
  //create Score fpr Player 0
  var style0 = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "right", boundsAlignV: "middle" };
  var scorePlayer0 = game.add.text(0, 0, "0", style0);
  scorePlayer0.setTextBounds(0, 0, (game.width / 2) - 20, 64)

  //Create seperator
  var styleSeperator = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
  var seperator = game.add.text(0, 0, ":", styleSeperator);
  seperator.setTextBounds((game.width / 2) - 20, 0, 40, 64)

  var style1 = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "left", boundsAlignV: "middle" };
  var scorePlayer1 = game.add.text(0, 0, "0", style1);
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
    {"upperWall" : upperWall, "lowerWall": lowerWall, "pointWall": leftWall, "opponentScoreText": scorePlayer1},
    {"upperWall" : upperWall, "lowerWall": lowerWall, "pointWall": rightWall, "opponentScoreText": scorePlayer0}
  ];
  return walls;
};

function getPlayerInfoPack(playerNumber){
  return playerInfoPack[playerNumber];
};

function createWall(game, sprite, positions) {
  var wall = new Wall(game, sprite, positions.from, positions.to);
  return wall;
}

module.exports.buildField = buildField;
module.exports.getPlayerInfoPack = getPlayerInfoPack;

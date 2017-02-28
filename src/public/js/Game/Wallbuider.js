var Wall = require('./Wall.js');


var field2Player = {
  walls: [{from: {x: 0, y: 64}, to: {x: 640, y: 64}},
    {from: {x: 640, y: 440}, to: {x: 0, y: 440}}],
  scoreWalls: [{from: {x: 640, y: 64}, to: {x: 640, y: 440}},
    {from: {x: 0, y: 440}, to: {x: 0, y: 64}}],
  movingPaths: [{from: {x: 0, y: 64}, to: {x: 0, y: 440}},
    {from: {x: 640, y: 64}, to: {x: 640, y: 440}}]
};

var field3Player = {
//148,403
//219,115
//669,115
//881,403
//668,690
//291,690
//ToDo: Only 3 Walls are defined. Also Pointswalls
  walls: [{from: {x: 99, y: 268}, to: {x: 195, y: 77}},
    {from: {x: 446, y: 77}, to: {x: 542, y: 268}},
    {from: {x: 446, y: 460}, to: {x: 195, y: 460}}]
};

// Color Codes for the paddles, although only 4 paddles are used all 6 are defined
// Grey, Red, Green, Blue, Yellow, Pink
var colorCodes = {
  grey: "#BDBDBD",
  red: "#FF0000",
  green: "#00FF00",
  blue: "#0000FF",
  yellow: "#FFFF00",
  pink: "#FF00FF"
};


var fieldInfo = [];

var build2PlayerField = function (game, wallSprite) {
  //create Score fpr Player 0
  var style0 = {font: "bold 32px Arial", fill: "#fff", boundsAlignH: "right", boundsAlignV: "middle"};
  var scorePlayer0 = game.add.text(0, 0, "0", style0);
  scorePlayer0.setTextBounds(0, 0, (game.width / 2) - 20, 64);

  //Create separator
  var styleSeparator = {font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle"};
  var separator = game.add.text(0, 0, ":", styleSeparator);
  separator.setTextBounds((game.width / 2) - 20, 0, 40, 64);


  var style1 = {font: "bold 32px Arial", fill: "#fff", boundsAlignH: "left", boundsAlignV: "middle"};
  var scorePlayer1 = game.add.text(0, 0, "0", style1);
  scorePlayer1.setTextBounds((game.width / 2) + 20, 0, (game.width / 2) - 20, 64);
  var walls = game.add.group();

  createStaticWalls(game, wallSprite, field2Player.walls, walls);

  fieldInfo = [
    {"boundA": upperWall, "boundB": lowerWall, "pointWall": leftWall, "opponentScoreText": scorePlayer1, path:field2Player.movingPaths[0]},
    {"boundA": upperWall, "boundB": lowerWall, "pointWall": rightWall, "opponentScoreText": scorePlayer0}
  ];

  return walls;
};

function getPlayerInfoPack(playerNumber) {
  return playerInfoPack[playerNumber];
}

function createWall(game, sprite, positions) {
  return new Wall(game, sprite, positions.from, positions.to);
}

function createStaticWalls(game, sprite, _walls, group) {
  _walls.forEach(function (wall) {
    group.add(createWall(game, sprite, wall));
  });
}
function createTextStyles() {

}
module.exports.buildField = buildField;
module.exports.getPlayerInfoPack = getPlayerInfoPack;

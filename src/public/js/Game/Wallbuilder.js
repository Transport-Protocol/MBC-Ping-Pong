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
  walls: [{from: {x: 99, y: 268}, to: {x: 195, y: 77}},
    {from: {x: 446, y: 77}, to: {x: 542, y: 268}},
    {from: {x: 446, y: 460}, to: {x: 195, y: 460}}],
  scoreWalls: [{from: {x: 195, y: 77}, to: {x: 446, y: 77}},
    {from: {x: 542, y: 268}, to: {x: 446, y: 460}},
    {from: {x: 195, y: 460}, to: {x: 99, y: 268}}],
  movingPaths: [{from: {x: 195, y: 77}, to: {x: 446, y: 77}},
    {from: {x: 542, y: 268}, to: {x: 446, y: 460}},
    {from: {x: 195, y: 460}, to: {x: 99, y: 268}}],
};

// Color Codes for the paddles, although only 4 paddles are used all 6 are defined
// Grey, Red, Green, Blue, Yellow, Pink
var colorCodes = {
  grey: "#BDBDBD",
  red: "#FF0000",
  green: "#00FF00",
  blue: "#0000FF",
  yellow: "#FFFF00",
  pink: "#FF00FF",
  white: "#FFF"
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

  var pointWall1 = createWall(game, wallSprite, field2Player.scoreWalls[0]);
  var pointWall2 = createWall(game, wallSprite, field2Player.scoreWalls[1]);

  fieldInfo = [
    {"pointWall": pointWall1, "opponentScoreText": scorePlayer1, path: field2Player.movingPaths[0]},
    {"pointWall": pointWall2, "opponentScoreText": scorePlayer0, path: field2Player.movingPaths[1]}
  ];

  return walls;
};

var build3PlayerField = function (game, wallSprite) {
  var scorePlayer0 = createText(game, colorCodes.grey);
  scorePlayer0.setTextBounds(0, 0, (game.width / 2) - 20, 64);

  var scorePlayer1 = createText(game, colorCodes.red);
  scorePlayer1.setTextBounds((game.width / 2) - 20, 0, 40, 64);


  var scorePlayer2 = createText(game, colorCodes.green);
  scorePlayer2.setTextBounds((game.width / 2) + 20, 0, (game.width / 2) - 20, 64);

  var walls = game.add.group();

  createStaticWalls(game, wallSprite, field3Player.walls, walls);

  var pointWall1 = createWall(game, wallSprite, field3Player.scoreWalls[0]);
  var pointWall2 = createWall(game, wallSprite, field3Player.scoreWalls[1]);
  var pointWall3 = createWall(game, wallSprite, field3Player.scoreWalls[2]);

  pointWall1.renderable = false;
  pointWall2.renderable = false;
  pointWall3.renderable = false;
  walls.add(pointWall1);
  walls.add(pointWall2);
  walls.add(pointWall3);

  fieldInfo = [
    {"pointWall": pointWall1, "opponentScoreText": scorePlayer0, path: field3Player.movingPaths[0]},
    {"pointWall": pointWall2, "opponentScoreText": scorePlayer1, path: field3Player.movingPaths[1]},
    {"pointWall": pointWall3, "opponentScoreText": scorePlayer2, path: field3Player.movingPaths[2]}
  ];

  return walls;
};

function getPlayerInfoPack(playerNumber) {
  return fieldInfo[playerNumber];
}

function createWall(game, sprite, positions) {
  return new Wall(game, sprite, positions.from, positions.to);
}

function createStaticWalls(game, sprite, _walls, group) {
  _walls.forEach(function (wall) {
    group.add(createWall(game, sprite, wall));
  });
}
function createText(game, color) {
  var style0 = {font: "bold 32px Arial", fill: color, boundsAlignH: "center", boundsAlignV: "middle"};
  return game.add.text(0, 0, "0", style0);
}
module.exports.build2PlayerField = build2PlayerField;
module.exports.build3PlayerField = build3PlayerField;
module.exports.build4PlayerField = build2PlayerField; //ToDo, 4 Player
module.exports.getPlayerInfoPack = getPlayerInfoPack;

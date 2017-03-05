var Wall = require('./Wall.js');


var field2Player = {
  walls: [{from: {x: 0, y: 64}, to: {x: 640, y: 64}},
    {from: {x: 640, y: 440}, to: {x: 0, y: 440}}],
  scoreWalls: [{from: {x: 640, y: 64}, to: {x: 640, y: 440}},
    {from: {x: 0, y: 440}, to: {x: 0, y: 64}}],
  movingPaths: [{from: {x: 20, y: 440}, to: {x: 20, y: 64}},
    {from: {x: 620, y: 440}, to: {x: 620, y: 64}}]
};

var field3Player = {
  walls: [{from: {x: 99, y: 268}, to: {x: 195, y: 77}},
    {from: {x: 446, y: 77}, to: {x: 542, y: 268}},
    {from: {x: 446, y: 460}, to: {x: 195, y: 460}}],
  scoreWalls: [{from: {x: 195, y: 57}, to: {x: 446, y: 57}},
    {from: {x: 542 + 14, y: 268 + 14}, to: {x: 446 + 14, y: 460 + 14}},
    {from: {x: 195 - 14, y: 460 + 14}, to: {x: 99 - 14, y: 268 + 14}}],
  movingPaths: [{from: {x: 446, y: 77}, to: {x: 195, y: 77}},
    {from: {x: 446, y: 460}, to: {x: 542, y: 268}},
    {from: {x: 195, y: 460}, to: {x: 99, y: 268}}]
};

var field4Player = {
  walls: [{from: {x: 112, y: 128}, to: {x: 189, y: 51}},
    {from: {x: 450, y: 51}, to: {x: 528, y: 128}},
    {from: {x: 528, y: 393}, to: {x: 450, y: 468}},
    {from: {x: 189, y: 468}, to: {x: 112, y: 393}}],
  scoreWalls: [{from: {x: 189, y: 31}, to: {x: 450, y: 31}},
    {from: {x: 548, y: 128}, to: {x: 548, y: 393}},
    {from: {x: 450, y: 488}, to: {x: 189, y: 488}},
    {from: {x: 92, y: 393}, to: {x: 92, y: 128}}],
  movingPaths: [{from: {x: 450, y: 51}, to: {x: 189, y: 51}},
    {from: {x: 528, y: 393}, to: {x: 528, y: 128}},
    {from: {x: 189, y: 468}, to: {x: 450, y: 468}},
    {from: {x: 112, y: 393}, to: {x: 112, y: 128}}]
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
    {"pointWall": pointWall2, "opponentScoreText": scorePlayer1, path: field2Player.movingPaths[0]},
    {"pointWall": pointWall1, "opponentScoreText": scorePlayer0, path: field2Player.movingPaths[1]}
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

var build4PlayerField = function (game, wallSprite) {
  resizeWindow(game, game.properties.width, game.properties.height + 40)
  var scorePlayer0 = createText(game, colorCodes.grey);
  scorePlayer0.setTextBounds(0, 0, (game.width / 4), 64);

  var scorePlayer1 = createText(game, colorCodes.red);
  scorePlayer1.setTextBounds((game.width / 4), 0, (game.width / 4), 64);


  var scorePlayer2 = createText(game, colorCodes.green);
  scorePlayer2.setTextBounds((game.width / 2), 0, (game.width / 4), 64);

  var scorePlayer3 = createText(game, colorCodes.blue);
  scorePlayer3.setTextBounds((game.width / 4) * 3, 0, (game.width / 4), 64);

  var walls = game.add.group();

  createStaticWalls(game, wallSprite, field4Player.walls, walls);

  var pointWall1 = createWall(game, wallSprite, field4Player.scoreWalls[0]);
  var pointWall2 = createWall(game, wallSprite, field4Player.scoreWalls[1]);
  var pointWall3 = createWall(game, wallSprite, field4Player.scoreWalls[2]);
  var pointWall4 = createWall(game, wallSprite, field4Player.scoreWalls[3]);

  pointWall1.renderable = false;
  pointWall2.renderable = false;
  pointWall3.renderable = false;
  pointWall4.renderable = false;
  walls.add(pointWall1);
  walls.add(pointWall2);
  walls.add(pointWall3);
  walls.add(pointWall4);

  fieldInfo = [
    {"pointWall": pointWall1, "opponentScoreText": scorePlayer0, path: field4Player.movingPaths[0]},
    {"pointWall": pointWall2, "opponentScoreText": scorePlayer1, path: field4Player.movingPaths[1]},
    {"pointWall": pointWall3, "opponentScoreText": scorePlayer2, path: field4Player.movingPaths[2]},
    {"pointWall": pointWall4, "opponentScoreText": scorePlayer3, path: field4Player.movingPaths[3]}
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
  return game.add.text(0, 0, "10", style0);
}
function resizeWindow(game, _width, _height) {
  game.width = _width;
  game.height = _height;
  game.stage.width = _width;
  game.stage.height = _height;
  if (game.renderType === Phaser.WEBGL) {
    game.renderer.resize(_width, _height);
  }
  game.world.setBounds(0, 0, _width, _height);
  game.camera.setSize(_width, _height);
  game.camera.setBoundsToWorld();
  game.scale.setShowAll();
  game.scale.refresh();
}

module.exports.build2PlayerField = build2PlayerField;
module.exports.build3PlayerField = build3PlayerField;
module.exports.build4PlayerField = build4PlayerField;
module.exports.getPlayerInfoPack = getPlayerInfoPack;

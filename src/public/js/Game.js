var Player = require('./Player.js');

var gameProperties = {
    name: 'engineTest',
    width: 640,
    height: 320,
    playerIdCount: 0,
    players: new Map(),
    freeSprites:[0,1]
};




var mainState = function(game) {};
mainState.prototype = {
    preload: function() {
        // New spritesheet, width:9, height:100, count:6 (frames)
        game.load.spritesheet('paddle', 'assets/testPaddles.png', 9, 100, 6);
    },

    create: function() {},

    update: function() {},
};

var game = new Phaser.Game(gameProperties.width, gameProperties.height, Phaser.CANVAS, gameProperties.name, mainState);



function addPlayerToGame(){
  var xval = 32-9;
  if(gameProperties.playerIdCount == 1) {xval = gameProperties.width-32}
  if(gameProperties.freeSprites.length > 0){
    var player = new Player(game, xval, 0, gameProperties.height - 100, 'paddle', gameProperties.freeSprites.shift());
    var playerId = gameProperties.playerIdCount++;
    gameProperties.players.set(playerId, player);
    game.add.existing(player);
    return playerId;
  }else {
    return undefined;
  }
}

function removePlayerFromGame(playerId){
  player = gameProperties.players.get(playerId);
  if(player){
    gameProperties.players.delete(playerId)
    gameProperties.freeSprites.push(player.frame);
    player.destroy();
  } else {
    console.error("Cannot find Player with Id: " + playerId);
  }
}

function addPositionToPlayerBuffer(playerId, x, y){
  player = gameProperties.players.get(playerId);
  if(player){
    player.addPositionToBuffer(x,y);
  } else {
    console.error("Cannot find Player with Id: " + playerId);
  }
}

module.exports.removePlayerFromGame = removePlayerFromGame;
module.exports.addPlayerToGame = addPlayerToGame;
module.exports.addPositionToPlayerBuffer = addPositionToPlayerBuffer;

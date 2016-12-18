var Player = require('./Player.js');

var gameProperties = {
    name: 'engineTest',
    width: 640,
    height: 320,
    playerIdCount: 0,
    players: new Map(),
    freeSprites:[0,1,2,3,4,5]
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
/*game.state.add('main', mainState);
game.state.start('main');*/


function addPlayerToGame(){
  if(gameProperties.freeSprites.length > 0){
    var player = new Player(game, 0, 0, 'paddle', gameProperties.freeSprites.shift());
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

/*
function addNewPlayer() {
    var newId = gameProperties.playerCount++;
    if (newId > 5) {
        console.log("ERR Player limit exceed")
        return;
    }
    var player = {
        id: newId,
        x: 80 * newId,
        y: game.world.centerY,
        sprite: undefined
    };
    console.log(player);
    gameProperties.aryPlayers.push(player);
    assignPlayerSprite(player);

}

function assignPlayerSprite(player) {
    player.sprite = game.add.sprite(player.x, player.y, 'paddle');
    player.sprite.frame = player.id;
}*/

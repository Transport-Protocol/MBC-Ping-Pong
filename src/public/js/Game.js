var Player = require('./Player.js');

var gameProperties = {
    name: 'engineTest',
    width: 640,
    height: 320,
    playerCount: 0,
    aryPlayers: []
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
  var player = new Player(game, 0, 0, 'paddle');
  console.log(player);
  game.add.existing(player);
  return player;
}
window.LogData = function(){
  addPlayerToGame();
}
module.exports.addPlayerToGame = addPlayerToGame;

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

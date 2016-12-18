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

var game = new Phaser.Game(gameProperties.width, gameProperties.height, Phaser.CANVAS, gameProperties.name);
game.state.add('main', mainState);
game.state.start('main');

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
}

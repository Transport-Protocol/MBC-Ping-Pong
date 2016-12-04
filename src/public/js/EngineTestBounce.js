var gameProperties = {
    name: 'engineTest',
    width:  320,
    height:  320,
};

var mainState = function(game){};
mainState.prototype = {
    preload: function () {
        game.load.image('ball','assets/testBall.png')
        this.ball
    },

    create: function () {
        // Add Ball
        this.ball = game.add.sprite(game.world.centerX, game.world.centerY, 'ball');
        this.ball.anchor.set(0.5, 0.5);

        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.enable(this.ball, Phaser.Physics.ARCADE);

        // Ball config:
        this.ball.checkWorldBounds = true;
        this.ball.body.collideWorldBounds = true;
        this.ball.body.immovable = true; //An immovable Body will not receive any impacts from other bodies.
        this.ball.body.bounce.set(1);
        this.ball.body.velocity.setTo(200,0);
    },

    update: function () {

    },
};

var game = new Phaser.Game(gameProperties.width, gameProperties.height, Phaser.CANVAS, gameProperties.name);
game.state.add('main', mainState);
game.state.start('main');
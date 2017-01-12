var abstractState = require('./AbstractState.js');

var state = function (game) {
  abstractState.call(this, game);

  this.init = function () {
    console.log("load");
  };

  this.preload = function () {
    this.game.load.spritesheet('paddle', 'assets/testPaddles.png', 9, 100, 6);
    this.game.load.image('wall', 'assets/wall.png');
    this.game.load.image('ball', 'assets/testBall.png');
    this.game.load.image('timerBackground', 'assets/timerBackground.png');
  };

  this.create = function () {
    this.initPhysics();
    this.game.state.start("InitializeNewGame");
  };

  this.initPhysics = function () {
    this.game.physics.startSystem(Phaser.Physics.P2JS);
    this.game.physics.p2.restitution = 1.0017;
    this.game.physics.p2.applyDamping = false;
    this.game.physics.p2.setImpactEvents(true);
  };
};

state.prototype = Object.create(abstractState.prototype);
state.prototype.constructor = state;

module.exports = state;

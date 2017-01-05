var Game = require('./../Game.js')

var Ball = function (game, x, y) {
  Phaser.Sprite.call(this, game, 200,200, 'ball');


  game.physics.p2.enable(this, Game.gameProperties.debug);
  this.body.setCircle(16);
  this.body.angle = 80;
  this.body.thrust(20000);


}

Ball.prototype = Object.create(Phaser.Sprite.prototype);
Ball.prototype.constructor = Ball;

//Interface
module.exports = Ball;

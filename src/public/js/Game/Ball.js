
var Ball = function (game, x, y) {
  Phaser.Sprite.call(this, game, x, y, 'ball');


  game.physics.p2.enable(this, this.game.properties.debug);
  this.body.setCircle(16);
  this.body.angle = 80;


}

Ball.prototype = Object.create(Phaser.Sprite.prototype);
Ball.prototype.constructor = Ball;

//Interface
module.exports = Ball;

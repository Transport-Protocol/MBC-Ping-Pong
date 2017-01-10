
var Ball = function (game, x, y) {
  var self = this;
  Phaser.Sprite.call(this, game, x, y, 'ball');
  var initialX = x;
  var initialY = y;

  var generateRandomDirection = function(){
    var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
    return plusOrMinus * ((Math.random() * (0.6 * Math.PI)) + (0.2 * Math.PI))
  }
  game.physics.p2.enable(this, this.game.properties.debug);
  self.body.setCircle(16);

  this.start = function(){
    self.body.rotation = generateRandomDirection();
    self.body.thrust(10000);
  };
  this.stop = function(){
    self.body.thrust(0);
  };
  this.reset = function(){
    self.body.x = initialX;
    self.body.y = initialY;
    this.start();
  };

}

Ball.prototype = Object.create(Phaser.Sprite.prototype);
Ball.prototype.constructor = Ball;

//Interface
module.exports = Ball;

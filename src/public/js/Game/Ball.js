
var Ball = function (game, x, y) {
  var self = this;
  Phaser.Sprite.call(this, game, x, y, 'ball');
  var initialSpeed = 300;
  var speedUpValue = 20;
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
    self.body.velocity.x = initialSpeed * Math.sin(self.body.rotation);
    self.body.velocity.y = initialSpeed * Math.cos(self.body.rotation);

  };
  this.stop = function(){
    self.body.velocity.x = 0;
    self.body.velocity.y = 0;
  };
  this.reset = function(){
    self.body.x = initialX;
    self.body.y = initialY;
    this.start();
  };
  this.speedUp = function(){

    var absoluteSpeed = Math.abs(self.body.velocity.x) + Math.abs(self.body.velocity.y)

    var xSpeedUp = (self.body.velocity.x / absoluteSpeed) * speedUpValue;
    var ySpeedUp = (self.body.velocity.y / absoluteSpeed) * speedUpValue;
    self.body.velocity.x = self.body.velocity.x + xSpeedUp;
    self.body.velocity.y = self.body.velocity.y + ySpeedUp;
    console.log("collide! velocity.x:" + self.body.velocity.x + ",self.body.velocity.y : " + self.body.velocity.y + ", xSpeedUp: " + xSpeedUp + ", ySpeedUp: " + ySpeedUp);
  }

}

Ball.prototype = Object.create(Phaser.Sprite.prototype);
Ball.prototype.constructor = Ball;

//Interface
module.exports = Ball;

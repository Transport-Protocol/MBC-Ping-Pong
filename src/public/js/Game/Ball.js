var Ball = function (game, x, y) {
  var self = this;
  Phaser.Sprite.call(this, game, x, y, 'ball');
  var initialSpeed = 300;
  var speedUpValue = 20;
  var initialX = x;
  var initialY = y;
  var RESET_DELAY_IN_SECONDS = 1.5;
  var MAX_VELOCITY = 2000;

  game.physics.p2.enable(this, this.game.properties.debug);
  self.body.setCircle(16);
  self.body.data.ccdSpeedThreshold = 38.75;
  self.body.data.ccdIterations = 10;

  var generateRandomDirection = function () {
    var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
    return plusOrMinus * ((Math.random() * (0.6 * Math.PI)) + (0.2 * Math.PI))
  };

  this.start = function () {
    self.body.rotation = generateRandomDirection();
    self.body.velocity.x = initialSpeed * Math.sin(self.body.rotation);
    self.body.velocity.y = initialSpeed * Math.cos(self.body.rotation);
  };

  this.stop = function () {
    self.body.velocity.x = 0;
    self.body.velocity.y = 0;
  };

  this.reset = function () {
    self.body.x = initialX;
    self.body.y = initialY;
    self.body.velocity.x = 0;
    self.body.velocity.y = 0;

    self.game.time.events.add(Phaser.Timer.SECOND * RESET_DELAY_IN_SECONDS, this.start, this);
  };

  this.speedUp = function () {
    var angle = Math.atan2(self.body.velocity.y, self.body.velocity.x);

    var xSpeedUp = Math.cos(angle) * speedUpValue;
    var ySpeedUp = Math.sin(angle) * speedUpValue;
    self.body.velocity.x = self.body.velocity.x + xSpeedUp;
    self.body.velocity.y = self.body.velocity.y + ySpeedUp;
    var vx = self.body.velocity.x;
    var vy = self.body.velocity.y;
    var currVelocitySqr = vx * vx + vy * vy;
    if (currVelocitySqr > MAX_VELOCITY * MAX_VELOCITY) {
      angle = Math.atan2(vy, vx);
      vx = Math.cos(angle) * MAX_VELOCITY;
      vy = Math.sin(angle) * MAX_VELOCITY;
      self.body.velocity.x = vx;
      self.body.velocity.y = vy;
    }
    console.log("collide! velocity.x:" + self.body.velocity.x + ",self.body.velocity.y : " + self.body.velocity.y + ", xSpeedUp: " + xSpeedUp + ", ySpeedUp: " + ySpeedUp);
  };

  function constrainVelocity(sprite, maxVelocity) {

    vx = self.body.velocity.x;
    vy = self.body.velocity.y;
    currVelocitySqr = vx * vx + vy * vy;
    if (currVelocitySqr > MAX_VELOCITY * MAX_VELOCITY) {
      angle = Math.atan2(vy, vx);
      vx = Math.cos(angle) * MAX_VELOCITY;
      vy = Math.sin(angle) * MAX_VELOCITY;
      self.body.velocity.x = vx;
      self.body.velocity.y = vy;
    }
  }

};

Ball.prototype = Object.create(Phaser.Sprite.prototype);
Ball.prototype.constructor = Ball;

//Interface
module.exports = Ball;

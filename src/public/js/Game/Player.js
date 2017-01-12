var Player = function (game, wallPack, ball, key, frame) {
  var _ball = ball;
  var _wallPack = wallPack;
  var _game = game;
  var _frame = frame;
  var points = 10;
  var maxPoints = points;
  var xDiff = Math.round(20 * Math.sin(wallPack.pointWall.body.rotation + (0.5 * Math.PI)));
  var yDiff = Math.round(20 * Math.cos(wallPack.pointWall.body.rotation + (0.5 * Math.PI)));
  console.log(xDiff + " : " + yDiff);
  Phaser.Sprite.call(this, game, wallPack.pointWall.body.x + xDiff, wallPack.pointWall.body.y + yDiff, key, _frame);

  // Set Physic
  game.physics.p2.enable(this, this.game.properties.debug);
  this.body.rotation = wallPack.pointWall.body.rotation;
  this.body.kinematic = true;
  this.body.setRectangle(32, this.height, -16, 0);

  this.body.createBodyCallback(ball, this.collideWithBall, this);
  wallPack.pointWall.body.createBodyCallback(ball, this.collideWithPointwall, this);


  var _buffer = [];

  this.collideWithBall = function (playerBody, ballBody) {
    _ball.speedUp();
  };

  this.collideWithPointwall = function (wallBody, ballBody) {
    points--;
    console.log("Hit PointWall, Points: " + points);
    _wallPack.opponentScoreText.text = "" + (maxPoints - points);
    if (points <= 0) {
      _game.state.start("GameEnded", false, false);
    } else {
      _ball.reset();
    }
  };

  this.addPositionToBuffer = function (x, y) {
    _buffer.push({"x": x, "y": y});
  };

  this.update = function () {

    while (_buffer.length > 0) {
      var pos = _buffer.shift();
      //@TODO: diagonal movement is impossible
      if (pos.y - this.height / 2 < wallPack.upperWall.y) {
        this.body.y = wallPack.upperWall.y + this.height / 2;
      } else if (pos.y + this.height / 2 > wallPack.lowerWall.y) {
        this.body.y = wallPack.lowerWall.y - this.height / 2;
      } else {
        this.body.y = pos.y;
      }
      //this.body.y = Math.max(Math.min(wallPack.lowerWall.body.y, pos.y - this.height/2) + this.height, wallPack.upperWall.body.y);
    }
  };

  this.getPoints = function () {
    return maxPoints - points;
  };

  this.getPlayerName = function () {
    switch (_frame) {
      case 0:
        return "left";
        break;
      case 1:
        return "rechts";
        break;
      case 2:
        return "oben";
        break;
      case 3:
        return "unten";
        break;
      default:
        return "undefined";
    }
  }
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

//Interface
module.exports = Player;

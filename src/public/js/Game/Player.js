var Player = function (game, fieldInfo, ball, sprite, frame) {
  var _ball = ball;
  var _fieldInfo = fieldInfo;
  var _game = game;
  var _frame = frame;
  var points = 10;
  var maxPoints = points;
  var place = placePlayer(fieldInfo);
  Phaser.Sprite.call(this, game, place.x, place.y, sprite, _frame);

  // Set Physic
  game.physics.p2.enable(this, this.game.properties.debug);
  this.body.rotation = fieldInfo.pointWall.body.rotation;
  this.body.kinematic = true;
  this.body.setRectangle(32, this.height, -16, 0);

  var _buffer = [];

  this.collideWithBall = function (playerBody, ballBody) {
    _ball.speedUp();
  };

  this.body.createBodyCallback(ball, this.collideWithBall, this);


  this.collideWithPointwall = function (wallBody, ballBody) {
    console.log("Hit PointWall, Points: " + points);
    if (_game.properties.mode == 2) {
      points--;
      _fieldInfo.opponentScoreText.text = "" + (maxPoints - points);
      if (points <= 0) {
        _game.state.start("GameEnded", false, false);
      } else {
        _ball.reset();
      }
    }
    else {
      if (this.getLives() > 0) {
        points--;

        _fieldInfo.opponentScoreText.text = "" + this.getLives();
        if (this.getLives() == 0) {
          fieldInfo.pointWall.renderable = true;
          this.destroy();
          if (--_game.properties.remainingPlayers <= 1) {
            _game.state.start("GameEnded", false, false);
          }
        } else {
          _ball.reset();
        }
      }
    }
  };

  fieldInfo.pointWall.body.createBodyCallback(ball, this.collideWithPointwall, this);

  this.addPositionToBuffer = function (x, y) {
    _buffer.push({"x": x, "y": y});
  };

  this.update = function () {
    while (_buffer.length > 0) {
      var pos = _buffer.shift();

      var path = fieldInfo.path;

      var dis = Phaser.Math.distance(path.from.x, path.from.y, path.to.x, path.to.y);
      var dx = ((path.from.x - path.to.x)) / dis;
      var dy = ((path.from.y - path.to.y)) / dis;

      var mM = Math.min(pos.y + this.height / 2, dis - this.height / 2);

      // Movement is working.
      this.body.x = path.to.x + mM * dx;
      this.body.y = path.to.y + mM * dy;
    }
  };

  this.getPoints = function () {
    return maxPoints - points;
  };

  this.getLives = function () {
    return points;
  };

  this.getPlayerName = function () {
    var names = ["Grau", "Rot", "Grün", "Blau"];
    return names[_frame];
  };


};

function placePlayer(fieldInfo) {
  var path = fieldInfo.path;

  var dis = Phaser.Math.distance(path.from.x, path.from.y, path.to.x, path.to.y);
  var dx = ((path.from.x - path.to.x)) / dis;
  var dy = ((path.from.y - path.to.y)) / dis;

  var mM = dis / 2;

  return {"x": path.to.x + mM * dx, "y": path.to.y + mM * dy};
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

//Interface
module.exports = Player;

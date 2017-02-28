var Player = function (game, fieldInfo, ball, sprite, frame) {
  var _ball = ball;
  var _fieldInfo = fieldInfo;
  var _game = game;
  var _frame = frame;
  var points = 10;
  var maxPoints = points;
  var xDiff = Math.round(20 * Math.sin(fieldInfo.pointWall.body.rotation + (0.5 * Math.PI)));
  var yDiff = Math.round(20 * Math.cos(fieldInfo.pointWall.body.rotation + (0.5 * Math.PI)));

  console.log(xDiff + " : " + yDiff);
  Phaser.Sprite.call(this, game, fieldInfo.pointWall.body.x + xDiff, fieldInfo.pointWall.body.y + yDiff, sprite, _frame);

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
    points--;
    console.log("Hit PointWall, Points: " + points);
    _fieldInfo.opponentScoreText.text = "" + (maxPoints - points);
    if (points <= 0) {
      _game.state.start("GameEnded", false, false);
    } else {
      _ball.reset();
    }
  };

  fieldInfo.pointWall.body.createBodyCallback(ball, this.collideWithPointwall, this);

  this.addPositionToBuffer = function (x, y) {
    _buffer.push({"x": x, "y": y});
  };

  this.update = function () {

    while (_buffer.length > 0) {
      var pos = _buffer.shift();
      //@TODO: diagonal movement is impossible
      //if (pos.y - this.height / 2 < fieldInfo.boundA.y) {
      //  this.body.y = fieldInfo.boundA.y + this.height / 2;
      //} else if (pos.y + this.height / 2 > fieldInfo.boundB.y) {
      //  this.body.y = fieldInfo.boundB.y - this.height / 2;
      //} else {
      //  this.body.y = pos.y;
      //}

      //Short names for all vars
      var pymi = pos.y - this.height / 2;
      var pyma= pos.y + this.height / 2;
      //var pxmi = pos.x - this.width / 2;
      //var pxma = pos.x + this.width / 2;
      var path = fieldInfo.path;
      var dis = Phaser.Math.distance(path.from.x,path.from.y,path.to.x,path.to.y);
      var dx = Phaser.Math.abs((path.from.x - path.to.x)) / dis;
      var dy = Phaser.Math.abs((path.from.y - path.to.y)) / dis;


      //if(pymi > path.from.y && pyma < path.to.y) {
      //  // New pos is not out of bounds
      //  this.body.y = pymi;
      //} else if(pyma > path.to.y) {
      //  this.body.y = pymi;
      //} else this.body.y = pos.y;
      //if (pxmi > path.from.x && pxma < path.to.x) {
      //  // New pos is not out of bounds
      //  this.body.x = pxmi;
      //}
      this.body.x = Math.min(pos.x,dis) * dx;
      this.body.y = Math.min(pos.y,dis) * dy;


      //this.body.y = Math.max(Math.min(fieldInfo.lowerWall.body.y, pos.y - this.height/2) + this.height, fieldInfo.upperWall.body.y);
    }
  };

  this.getPoints = function () {
    return maxPoints - points;
  };

  this.getPlayerName = function () {
    switch (_frame) {
      case 0:
        return "Links";
        break;
      case 1:
        return "Rechts";
        break;
      case 2:
        return "Oben";
        break;
      case 3:
        return "Unten";
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

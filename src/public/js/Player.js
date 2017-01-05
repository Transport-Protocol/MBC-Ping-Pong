var Player = function (game, x, y, from, maxHeight, key, frame) {
  Phaser.Sprite.call(this, game, x, y, key, frame);

  // Set Physic
  game.physics.p2.enable(this, true);
  this.body.static = true;


  //Todo Fix Positioning, then fix boundingbox
  if (x < from) {
    this.body.setRectangle(Phaser.Math.difference(x, from), 100, from - (x + 16));
  } else {
    this.body.setRectangle(Phaser.Math.difference(x, from), 100, from - x + 16);
  }


  var _buffer = [];

  this.addPositionToBuffer = function (x, y) {
    _buffer.push({"x": x, "y": y});
  }

  this.update = function () {
    while (_buffer.length > 0) {
      var pos = _buffer.shift();
      //FIXME

      //this.body.moveDown(Phaser.Math.difference(pos.y,this.y));
      this.body.y = Math.max(Math.min(pos.y, maxHeight), 0);
    }
  }
}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

//Interface
module.exports = Player;

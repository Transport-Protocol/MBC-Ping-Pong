
var Player = function (game, x, y, key){
  console.log(game);
  console.log(key);
  Phaser.Sprite.call(this, game, x, y, key);
  var _buffer = [];

  this.addPositionToBuffer = function(x, y){
    _buffer.push({"x": x, "y": y});
  }

  this.update = function(){
    while(_buffer.length > 0){
      var pos = _buffer.shift();
      this.x = pos.x;
      this.y = pos.y;
    }
  }
}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

//Interface
module.exports = Player;

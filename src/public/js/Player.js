var Game = require('./Game.js')

var Player = function (game, x, y, maxHeight, key, frame){
  Phaser.Sprite.call(this, game, x, y, key, frame);

  // Set Physic
  game.physics.p2.enable(this, gameProperties.debug);
  this.body.static = true;


  var _buffer = [];

  this.addPositionToBuffer = function(x, y){
    _buffer.push({"x": x, "y": y});
  }

  this.update = function(){
    while(_buffer.length > 0){
      var pos = _buffer.shift();
      this.y = Math.max(Math.min(pos.y,maxHeight),0);
    }
  }
}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

//Interface
module.exports = Player;

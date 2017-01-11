var Player = function (game, wallPack, key, frame) {
  var xDiff = Math.round(20 * Math.sin(wallPack.pointWall.body.rotation + (0.5 * Math.PI)));
  var yDiff = Math.round(20 * Math.cos(wallPack.pointWall.body.rotation + (0.5 * Math.PI)));
  console.log(xDiff + " : " + yDiff);
  Phaser.Sprite.call(this, game, wallPack.pointWall.body.x + xDiff , wallPack.pointWall.body.y + yDiff, key, frame);

  // Set Physic
  game.physics.p2.enable(this, this.game.properties.debug);
  this.body.static = true;
  this.body.rotation = wallPack.pointWall.body.rotation


  //Todo Fix Positioning, then fix boundingbox
  /*
  if (x < from) {
    this.body.setRectangle(Phaser.Math.difference(x, from), 100, from - (x + 16));
  } else {
    this.body.setRectangle(Phaser.Math.difference(x, from), 100, from - x + 16);
  }*/


  var _buffer = [];

  this.addPositionToBuffer = function (x, y) {
    _buffer.push({"x": x, "y": y});
  }

  this.update = function () {
    while (_buffer.length > 0) {
      var pos = _buffer.shift();
      //@TODO: diagonal movement is impossible
      if(pos.y - this.height / 2 < wallPack.upperWall.y){
        this.body.y = wallPack.upperWall.y + this.height/2;
      }else if(pos.y + this.height / 2 > wallPack.lowerWall.y){
        this.body.y = wallPack.lowerWall.y - this.height/2;
      }else{
        this.body.y = pos.y;
      }
      //this.body.y = Math.m      ax(Math.min(wallPack.lowerWall.body.y, pos.y - this.height/2) + this.height, wallPack.upperWall.body.y);
    }
  }
}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

//Interface
module.exports = Player;

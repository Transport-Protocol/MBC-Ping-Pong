var Game = require('./../Game.js')

var Wall = function (game, sprite, from, to) {
  Phaser.Sprite.call(this, game, from.x + (Phaser.Math.difference(from.x, to.x) / 2), from.y + (Phaser.Math.difference(from.y, to.y) / 2), sprite);


  //this.immovable = true;
  //this.body.moves = false;

  this.anchor.setTo(0, 0);
  //// Stretch Sprite to Endpoint
  //this.angle = -Phaser.Math.angleBetweenY(from.x, from.y, to.x, to.y) * 180 / Math.PI + 90;
  this.width = Phaser.Math.distance(from.x, from.y, to.x, to.y);

  game.physics.p2.enable(this, Game.gameProperties.debug);
  this.body.static = true;

  this.body.angle = -Phaser.Math.angleBetweenY(from.x, from.y, to.x, to.y) * 180 / Math.PI + 90;
}

Wall.prototype = Object.create(Phaser.Sprite.prototype);
Wall.prototype.constructor = Wall;

//Interface
module.exports = Wall;

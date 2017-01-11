var Wall = function (game, sprite, from, to) {
  Phaser.Sprite.call(
    this,
    game,
    from.x + Math.sign(to.x - from.x) * (Phaser.Math.difference(from.x, to.x) / 2),
    from.y + Math.sign(to.y - from.y) * (Phaser.Math.difference(from.y, to.y) / 2),
    sprite
  );

  this.anchor.setTo(0, 0);
  this.height = Phaser.Math.distance(from.x, from.y, to.x, to.y);

  game.physics.p2.enable(this, this.game.properties.debug);

  this.body.rotation = Phaser.Math.angleBetween(from.x, from.y, to.x, to.y) + 0.5 * Math.PI;
  this.body.kinematic = true;

  // Vergrößere die BoundinBox um tunneling zu minimieren
  this.body.setRectangle(64, this.height, -32, 0);
}

Wall.prototype = Object.create(Phaser.Sprite.prototype);
Wall.prototype.constructor = Wall;

//Interface
module.exports = Wall;

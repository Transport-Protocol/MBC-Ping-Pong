var Wall = function (game, sprite, from, to) {
    Phaser.Sprite.call(this, game, from.x, from.y, sprite);

    this.anchor.setTo(0, 0.5);
    // Stretch Sprite to Endpoint
    this.angle = -Phaser.Math.angleBetweenY(from.x, from.y, to.x, to.y) * 180 / Math.PI + 90;
    this.width = Phaser.Math.distance(from.x, from.y, to.x, to.y);
}

Wall.prototype = Object.create(Phaser.Sprite.prototype);
Wall.prototype.constructor = Wall;

//Interface
module.exports = Wall;
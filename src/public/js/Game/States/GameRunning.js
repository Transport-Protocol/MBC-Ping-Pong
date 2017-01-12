var abstractState = require('./abstractState.js');

var state = function (game) {
  var self = this;
  self.game = game;
  abstractState.call(this, self.game);

  this.init = function () {
    console.log("GameRunning");
  };

  this.preload = function () {
    // Don't pause game if the form looses focus
    this.game.stage.disableVisibilityChange = true;
  };

  this.create = function () {
    self.game.properties.ball.start();
  };

  this.shutdown = function () {
    self.game.properties.ball.stop();
  };

  this.removePlayer = function () {
    self.game.state.start("GameEnded", false, false);
  };
};

state.prototype = Object.create(abstractState.prototype);
state.prototype.constructor = state;

module.exports = state;

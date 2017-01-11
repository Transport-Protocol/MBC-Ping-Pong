var abstractState = require('./abstractState.js');

var state = function(game){
  var self = this;
  self.game = game;
  abstractState.call(this, self.game);
  this.init = function(){
  	console.log("GameRunning");
  };
  this.preload = function(){

  };
  this.create = function() {
    self.game.properties.ball.start();
  };
};

state.prototype = Object.create(abstractState.prototype);
state.prototype.constructor = state;

module.exports = state;

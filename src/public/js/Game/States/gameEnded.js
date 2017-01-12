var abstractState = require('./abstractState.js');
var state = function(game){
  abstractState.call(this, game);
  this.init = function(){
  	console.log("GameEnded");
  };
  this.preload = function () {

  };
  this.create = function() {

  };
  this.initPhysics = function () {

  };
};

state.prototype = Object.create(abstractState.prototype);
state.prototype.constructor = state;

module.exports = state;

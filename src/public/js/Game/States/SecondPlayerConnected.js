var abstractState = require('./abstractState.js');
var Ball = require('./../Ball.js');
var Player = require('./../Player.js');

var state = function(game){
  var self = this;
  self.game = game;
  abstractState.call(this, self.game);
  this.init = function(){
  	console.log("SecondPlayerConnected");
  };
  this.preload = function(){

  };

};

state.prototype = Object.create(abstractState.prototype);
state.prototype.constructor = state;

module.exports = state;

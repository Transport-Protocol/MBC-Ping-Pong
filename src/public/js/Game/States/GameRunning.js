var abstractState = require('./abstractState.js');
var Ball = require('./../Ball.js');
var Player = require('./../Player.js');
var QRious = require('qrious')

var state = function(game){
  var self = this;
  self.game = game;
  abstractState.call(this, self.game);
  this.init = function(){
  	console.log("GameRunning");
  };
  this.preload = function(){

  };
};

state.prototype = Object.create(abstractState.prototype);
state.prototype.constructor = state;

module.exports = state;

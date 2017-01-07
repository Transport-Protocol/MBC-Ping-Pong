var abstractState = require('./abstractState.js');
var Ball = require('./../Ball.js');
var Player = require('./../Player.js');

var state = function(game){
  var self = this;
  self.game = game;
  abstractState.call(this, self.game);
  this.init = function(wallBuilder){
    self.wallBuilder = wallBuilder;
  	console.log("FirstPlayerConnected");
  };
  this.preload = function(){

  };
  this.addPlayer = function(){
    var player = new Player(self.game, self.wallBuilder.getPlayerInfoPack(1), 'paddle', 1);
    //this.game.state.start("FirstPlayerConnected", false, false, self.wallBuilder);
    return player;
  }
};

state.prototype = Object.create(abstractState.prototype);
state.prototype.constructor = state;

module.exports = state;

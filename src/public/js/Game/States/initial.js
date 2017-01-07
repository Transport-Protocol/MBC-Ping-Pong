var abstractState = require('./abstractState.js');
var Ball = require('./../Ball.js');
var Player = require('./../Player.js');

var state = function(game){
  var self = this;
  self.game = game;
  abstractState.call(this, self.game);
  this.init = function(wallBuilder){
    self.wallBuilder = wallBuilder;
  	console.log("Initial");
  };
  this.preload = function(){
    self.game.properties.ball = new Ball(self.game,self.game.world.width / 2 ,self.game.world.height / 2);
    self.game.add.existing(self.game.properties.ball);
    self.game.properties.walls = self.wallBuilder.buildField(self.game, 'wall');
  };
  this.addPlayer = function(){
    var player = new Player(self.game, self.wallBuilder.getWallPack(0), 'paddle', 0);
    self.game.state.start("FirstPlayerConnected", false, false, self.wallBuilder);
    return player;
  }
};

state.prototype = Object.create(abstractState.prototype);
state.prototype.constructor = state;

module.exports = state;

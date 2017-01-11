var abstractState = require('./abstractState.js');
var Ball = require('./../Ball.js');
var Player = require('./../Player.js');

const TIME_TO_CONNECT_SECOND_PLAYER_IN_SECONDS = 30;
var state = function(game){
  var self = this;
  self.game = game;
  abstractState.call(this, self.game);
  this.init = function(wallBuilder){
    self.wallBuilder = wallBuilder;
  	console.log("FirstPlayerConnected");
  };
  this.preload = function(){
    self.circle = game.add.sprite(game.width/2 - 25,game.height/2 - 100,'timerBackground');

    //create Score fpr Player 0
    var timerTextStyle = { font: "bold 32px Arial", fill: "#FF0000", boundsAlignH: "center", boundsAlignV: "middle" };
    self.timerText = game.add.text(0, 0, "" + TIME_TO_CONNECT_SECOND_PLAYER_IN_SECONDS, timerTextStyle);
    self.timerText.setTextBounds(self.circle.x, self.circle.y, self.circle.width, self.circle.height);
  };
  this.create = function(){
    self.timer = game.time.create();
    self.timerEvent = self.timer.add(Phaser.Timer.SECOND * TIME_TO_CONNECT_SECOND_PLAYER_IN_SECONDS, function(){
      this.game.state.states[this.game.state.current].timeout();
    }, this);
    self.timer.start();
  };
  this.addPlayer = function(){
    var player = new Player(self.game, self.wallBuilder.getPlayerInfoPack(1), 'paddle', 1);
    this.game.state.start("SecondPlayerConnected", false, false);
    return player;
  };
  this.timeout = function(){
    this.game.state.start("InitializeNewGame", true, false);
  };
  this.render = function(){
    self.timerText.text = Math.round(self.timer.duration / 1000);
  };
  this.removePlayer = function(playerId){
    this.game.state.start("InitializeNewGame", true, false);
  };
  this.shutdown = function(){
    self.circle.destroy();
    self.timerText.destroy();
    self.timer.stop();
    self.timer.destroy();
  }
};

state.prototype = Object.create(abstractState.prototype);
state.prototype.constructor = state;

module.exports = state;

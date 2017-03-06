var abstractState = require('./AbstractState.js');
var Ball = require('./../Ball.js');
var Player = require('./../Player.js');
var wallBuilder = require("./../Wallbuilder.js");

const TIME_TO_CONNECT_SECOND_PLAYER_IN_SECONDS = 30;

var state = function (game) {
  var self = this;
  self.game = game;
  var playercount = 1;
  abstractState.call(this, self.game);

  this.init = function (maxPlayers) {
    playercount = 1;
    self.maxplayers = maxPlayers;
    self.wallBuilder = wallBuilder;
    console.log("FirstPlayerConnected");
  };

  this.preload = function () {
    // Don't pause game if the form looses focus
    this.game.stage.disableVisibilityChange = true;

    self.circle = game.add.sprite(game.width / 2 - 25, game.height / 2 - 100, 'timerBackground');

    var timerTextStyle = {font: "bold 32px Arial", fill: "#FF0000", boundsAlignH: "center", boundsAlignV: "middle"};
    self.timerText = game.add.text(0, 0, "" + TIME_TO_CONNECT_SECOND_PLAYER_IN_SECONDS, timerTextStyle);
    self.timerText.setTextBounds(self.circle.x, self.circle.y, self.circle.width, self.circle.height);
  };

  this.create = function () {
    self.timer = game.time.create();
    self.timerEvent = self.timer.add(Phaser.Timer.SECOND * TIME_TO_CONNECT_SECOND_PLAYER_IN_SECONDS, function () {
      this.game.state.states[this.game.state.current].timeout();
    }, this);
    self.timer.start();
  };

  this.addPlayer = function () {
    var player = new Player(self.game, self.wallBuilder.getPlayerInfoPack(playercount), self.game.properties.ball, 'paddle', playercount);
    console.log("NAME: " + player.getPlayerName());
    playercount++;
    console.log(playercount);
    console.log(self.maxplayers)
    if (playercount == self.maxplayers) {
      this.game.state.start("AllPlayersConnected", false, false);
    }
    return player;
  };

  this.timeout = function () {
    this.game.state.start("InitializeNewGame", true, false);
  };

  this.render = function () {
    self.timerText.text = Math.round(self.timer.duration / 1000);
  };

  this.removePlayer = function (playerId) {
    this.game.state.start("InitializeNewGame", true, false);
  };

  this.shutdown = function () {
    self.circle.destroy();
    self.timerText.destroy();
    self.timer.stop();
    self.timer.destroy();
  }
};

state.prototype = Object.create(abstractState.prototype);
state.prototype.constructor = state;

module.exports = state;

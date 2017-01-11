var abstractState = require('./AbstractState.js');

const TIME_UNTIL_RESTART_IN_SECONDS = 10;
var state = function (game) {
  var self = this;
  self.game = game;
  abstractState.call(this, game);

  this.init = function () {
    console.log("GameEnded");
  };
  this.preload = function () {
    //ToDo: Convert to Object, use Anchor
    self.circle = game.add.sprite(game.width / 2 - 25, game.height / 2, 'timerBackground');

    var timerTextStyle = {font: "bold 32px Arial", fill: "#FF0000", boundsAlignH: "center", boundsAlignV: "middle"};
    self.timerText = game.add.text(0, 0, "" + TIME_UNTIL_RESTART_IN_SECONDS, timerTextStyle);
    //ToDo: Convert to Object, use Anchor
    self.timerText.setTextBounds(self.circle.x, self.circle.y, self.circle.width, self.circle.height);
  };
  this.create = function () {
    this.printWinner();
    self.timer = game.time.create();
    self.timerEvent = self.timer.add(Phaser.Timer.SECOND * TIME_UNTIL_RESTART_IN_SECONDS,
      function () {
        this.game.state.states[this.game.state.current].timeout();
      }, this);

    self.timer.start();
  };
  this.timeout = function () {
    this.game.state.start("Initial", false, false);
  };
  this.render = function () {
    self.timerText.text = Math.round(self.timer.duration / 1000);
  };
  this.shutdown = function () {
    self.circle.destroy();
    self.timerText.destroy();
    self.timer.stop();
    self.timer.destroy();
  };
  this.printWinner = function () {
    var cmax = 0;
    var cwinner = undefined;


    game.gameProperties.players.forEach(checkPlayer);
    var winner = cwinner == undefined ? "Unentschieden!" : "Spieler: " + cwinner + " hat gewonnen!";

    self.textWon = game.add.text(game.width / 2, game.height / 2 - 100, winner);

    function checkPlayer(entry) {
      if (entry.getPoints > cmax) {
        cmax = entry.getPoints();
        cwinner = entry.getPlayerName();
      } else if (entry.getPoints() == cmax) {
        cwinner = undefined;
      }
    }
  };
};

state.prototype = Object.create(abstractState.prototype);
state.prototype.constructor = state;

module.exports = state;

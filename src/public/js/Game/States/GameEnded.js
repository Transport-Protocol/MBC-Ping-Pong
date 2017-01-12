var abstractState = require('./AbstractState.js');

const TIME_UNTIL_RESTART_IN_SECONDS = 10;

var state = function (game) {

  var self = this;
  self.game = game;
  abstractState.call(this, game);

  var textStyleTimer = {font: "bold 32px Arial", fill: "#FF0000", boundsAlignH: "center", boundsAlignV: "middle"};
  var textStyleWinner = {font: "bold 32px Arial", fill: "#FFFFFF", boundsAlignH: "center", boundsAlignV: "middle"};

  this.init = function () {
    console.log("GameEnded");
  };

  this.preload = function () {
    // Don't pause game if the form looses focus
    this.game.stage.disableVisibilityChange = true;

    //ToDo: Convert to Object, use Anchor
    self.circle = game.add.sprite(game.width / 2 - 25, game.height / 2, 'timerBackground');


    self.timerText = game.add.text(0, 0, "" + TIME_UNTIL_RESTART_IN_SECONDS, textStyleTimer);
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
    // Back to initial state after timeout,
    // 2nd parameter is true to reset all objects
    this.game.state.start("InitializeNewGame", true, false);
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
    var cmax = 99;
    var cwinner = undefined;


    self.game.properties.players.forEach(checkPlayer);

    var winner = cwinner == undefined ? "Unentschieden!" : "Spieler: " + cwinner + " hat gewonnen!";
    console.log("Text: " + winner);

    self.textWon = game.add.text(game.width / 2, game.height / 2 - 100, winner, textStyleWinner);
    self.textWon.anchor.setTo(0.5, 0.5);

    function checkPlayer(entry) {
      console.log("Playerscore " + entry.getPoints() + " - " + cmax);
      // Todo: Player Points might need to be reworked
      if (entry.getPoints() < cmax) {
        cmax = entry.getPoints();
        cwinner = entry.getPlayerName();
        console.log("New Winner " + cwinner);
      } else if (entry.getPoints() == cmax) {
        cwinner = undefined;
      }
      console.log("Winner is: " + cwinner);
    }
  };
};

state.prototype = Object.create(abstractState.prototype);
state.prototype.constructor = state;

module.exports = state;

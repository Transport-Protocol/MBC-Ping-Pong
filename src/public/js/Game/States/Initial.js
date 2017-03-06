var abstractState = require('./AbstractState.js');
var Ball = require('./../Ball.js');
var Player = require('./../Player.js');
var QRious = require('qrious');
var wallBuilder = require("./../Wallbuilder.js");


var state = function (game) {
  var self = this;
  self.game = game;
  abstractState.call(this, self.game);


  this.init = function (playercount) {
    self.wallBuilder = wallBuilder;
    console.log("Initial");
    self.playerCount = playercount;
  };

  this.preload = function () {
    // Don't pause game if the form looses focus
    this.game.stage.disableVisibilityChange = true;

    self.game.properties.ball = new Ball(self.game, self.game.world.width / 2, self.game.world.height / 2);
    self.game.add.existing(self.game.properties.ball);
    this.buildField();
    var url = window.location.href.slice(0, -1 * "DisplayPeer.html".length) + "ControlPeer.html#gameId=" + self.game.properties.gameId;
    document.getElementById('joinGamePanel').style.visibility = 'visible';
    var qr = new QRious({
      element: document.getElementById('qr-code'),
      value: url
    });
    document.getElementById('joinGameUrl').innerHTML = "<a href=\"" + url + "\">" + url + "</a>"
  };

  this.addPlayer = function () {
    var player = new Player(self.game, self.wallBuilder.getPlayerInfoPack(0), self.game.properties.ball, 'paddle', 0);
    self.game.state.start("PlayerConnected", false, false, self.playerCount);
    return player;
  };
  this.buildField = function () {
    switch (self.playerCount) {
      case 2:
        wallBuilder.build2PlayerField(game, "wall");
        break;
      case 3:
        wallBuilder.build3PlayerField(game, "wall");
        break;
      case 4:
        wallBuilder.build4PlayerField(game, "wall");
        break;
    }
  }
};

state.prototype = Object.create(abstractState.prototype);
state.prototype.constructor = state;

module.exports = state;

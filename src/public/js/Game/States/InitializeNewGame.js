var commHandler = require('./../../DisplayPeerCommunicationHandler.js');
var abstractState = require('./AbstractState.js');
var wallBuilder2Player = require('./../2PlayerField.js');

var state = function (game) {
  abstractState.call(this, game);
  this.init = function () {
    console.log("InitializeNewGame");
  };
  this.preload = function () {
    // Don't pause game if the form looses focus
    this.game.stage.disableVisibilityChange = true;

    this.cleanup();
    //@TODO: GameId should be regenerated each game. The if(!this.game.properties.gameId) is just a hotfix, to avoid a bug.
    if(!this.game.properties.gameId){
      this.game.properties.gameId = commHandler.init();
    }
  };
  this.create = function () {
    this.game.state.start("Initial", false, false, wallBuilder2Player);
  };
  this.cleanup = function () {
    this.game.properties.ball = undefined;
    this.game.properties.players = new Map();
  };
};

state.prototype = Object.create(abstractState.prototype);
state.prototype.constructor = state;

module.exports = state;

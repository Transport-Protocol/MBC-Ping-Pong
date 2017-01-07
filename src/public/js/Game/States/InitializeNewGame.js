var commHandler = require('./../../DisplayPeerCommunicationHandler.js');
var abstractState = require('./abstractState.js');
var wallBuilder2Player = require('./../2PlayerField.js');

var state = function(game){
  abstractState.call(this, game);
  this.init = function(){
  	console.log("InitializeNewGame");
  };
  this.preload = function(){
    this.game.properties.gameId = commHandler.init();

  };
  this.create = function(){
    this.game.state.start("Initial", false, false, wallBuilder2Player);
  };
};

state.prototype = Object.create(abstractState.prototype);
state.prototype.constructor = state;

module.exports = state;

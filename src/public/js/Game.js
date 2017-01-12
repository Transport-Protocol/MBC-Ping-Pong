var Player = require('./Game/Player.js');
var load = require('./Game/States/load.js');
var initializeNewGame = require('./Game/States/InitializeNewGame.js');
var initial = require('./Game/States/initial.js');
var firstPlayerConnected = require('./Game/States/FirstPlayerConnected.js');
var secondPlayerConnected = require('./Game/States/SecondPlayerConnected.js');
var gameRunning = require('./Game/States/GameRunning.js');
var gameEnded = require('./Game/States/gameEnded.js');

Phaser.StateManager.prototype.clearCurrentState = function () {
  if (this.current){
    if (this.onShutDownCallback) {
      this.onShutDownCallback.call(this.callbackContext, this.game);
    }
    this.game.scale.reset(this._clearWorld);
    if (this.game.debug){
      this.game.debug.reset();
    }
    if (this._clearWorld){
      this.game.camera.reset();
      this.game.input.reset(true);
      this.game.time.removeAll();
      this.game.tweens.removeAll();
      this.game.physics.clear();
      this.game.world.shutdown();
      if (this._clearCache){
        this.game.cache.destroy();
      }
    }
  }
};

var gameProperties = {
  name: 'engineTest',
  width: 640,
  height: 480,
  playerIdCount: 0,
  players: new Map(),
  debug: false,
  gameId: undefined,
  ball: undefined
};

var game = new Phaser.Game(gameProperties.width, gameProperties.height, Phaser.AUTO, gameProperties.name);
game.properties = gameProperties;

game.state.add('load', load);
game.state.add('InitializeNewGame', initializeNewGame);
game.state.add('Initial', initial);
game.state.add('FirstPlayerConnected', firstPlayerConnected);
game.state.add('SecondPlayerConnected', secondPlayerConnected);
game.state.add('GameRunning', gameRunning);
game.state.add('GameEnded', gameEnded);
game.state.start('load')

function addPlayerToGame() {

  var player = game.state.states[game.state.current].addPlayer();
  if (player) {
    var playerId = gameProperties.playerIdCount++;
    gameProperties.players.set(playerId, player);
    game.add.existing(player);
    return playerId;
  } else {
    return undefined;
  }
}

function removePlayerFromGame(playerId) {
  game.state.states[game.state.current].removePlayer(playerId);
}

function addPositionToPlayerBuffer(playerId, x, y) {
  player = gameProperties.players.get(playerId);
  if (player) {
    player.addPositionToBuffer(x, y);
  } else {
    console.error("Cannot find Player with Id: " + playerId);
  }
}

module.exports.removePlayerFromGame = removePlayerFromGame;
module.exports.addPlayerToGame = addPlayerToGame;
module.exports.addPositionToPlayerBuffer = addPositionToPlayerBuffer;
module.exports.gameProperties = gameProperties;

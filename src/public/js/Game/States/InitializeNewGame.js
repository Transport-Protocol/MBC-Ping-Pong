var commHandler = require('./../../DisplayPeerCommunicationHandler.js');
var abstractState = require('./AbstractState.js');


var state = function (game) {
  abstractState.call(this, game);
  this.init = function () {
    console.log("InitializeNewGame");
  };
  this.preload = function () {
    // Don't pause game if the form looses focus
    this.game.stage.disableVisibilityChange = true;

    //Buttons:
    game.load.spritesheet('button2', 'assets/button_2_player.png', 128, 128);
    game.load.spritesheet('button3', 'assets/button_3_player.png', 128, 128);
    game.load.spritesheet('button4', 'assets/button_4_player.png', 128, 128);

    this.cleanup();
    //@TODO: GameId should be regenerated each game. The if(!this.game.properties.gameId) is just a hotfix, to avoid a bug.
    if (!this.game.properties.gameId) {
      this.game.properties.gameId = commHandler.init();
    }
  };
  this.create = function () {

    // Create Buttons:
    this.game.button2Player = game.add.button(game.world.centerX - 160 - 64, 200, 'button2', this.start2Player, this, 2, 1, 0);
    this.game.button3Player = game.add.button(game.world.centerX - 64, 200, 'button3', this.start3Player, this, 2, 1, 0);
    this.game.button4Player = game.add.button(game.world.centerX + 160 - 64, 200, 'button4', this.start4Player, this, 2, 1, 0);
  };
  this.cleanup = function () {
    this.game.properties.ball = undefined;
    this.game.properties.players = new Map();
  };

  this.start2Player = function () {
    this.destroyButtons();
    this.game.state.start("Initial", false, false, 2);
  };
  this.start3Player = function () {
    this.destroyButtons();
    this.game.state.start("Initial", false, false, 3);
  };
  this.start4Player = function () {
    this.destroyButtons();
    this.game.state.start("Initial", false, false, 4);
  };
  this.destroyButtons = function () {
    this.game.button2Player.destroy();
    this.game.button3Player.destroy();
    this.game.button4Player.destroy();
  }
};


//In case we need to adjust the game view:
function resizeWindow(_width, _height) {
  game.width = _width;
  game.height = _height;
  game.stage.width = _width;
  game.stage.height = _height;
  if (game.renderType === Phaser.WEBGL) {
    game.renderer.resize(_width, _height);
  }
  game.world.setBounds(0, 0, _width, _height);
  game.camera.setSize(_width, _height);
  game.camera.setBoundsToWorld();
  game.scale.setShowAll();
  game.scale.refresh();
}

state.prototype = Object.create(abstractState.prototype);
state.prototype.constructor = state;

module.exports = state;

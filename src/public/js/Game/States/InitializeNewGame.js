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
    this.sizeToNormal();

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
    this.game.properties.mode = 2;
    this.game.properties.remainingPlayers = 2;
    this.game.state.start("Initial", false, false, 2);
  };
  this.start3Player = function () {
    this.destroyButtons();
    this.game.properties.mode = 3;
    this.game.properties.remainingPlayers = 3;
    this.game.state.start("Initial", false, false, 3);
  };
  this.start4Player = function () {
    this.destroyButtons();
    this.game.properties.mode = 4;
    this.game.properties.remainingPlayers = 4;
    this.game.state.start("Initial", false, false, 4);
  };
  this.destroyButtons = function () {
    this.game.button2Player.destroy();
    this.game.button3Player.destroy();
    this.game.button4Player.destroy();
  };
  this.sizeToNormal = function () {
    this.game.width = this.game.properties.width;
    this.game.height = this.game.properties.height;
    this.game.stage.width = this.game.properties.width;
    this.game.stage.height = this.game.properties.height;
    if (this.game.renderType === Phaser.WEBGL) {
      this.game.renderer.resize(this.game.properties.width, this.game.properties.height);
    }
    this.game.world.setBounds(0, 0, this.game.properties.width, this.game.properties.height);
    this.game.camera.setSize(this.game.properties.width, this.game.properties.height);
    this.game.camera.setBoundsToWorld();
    this.game.scale.setShowAll();
    this.game.scale.refresh();

  }
};


//In case we need to adjust the game view:


state.prototype = Object.create(abstractState.prototype);
state.prototype.constructor = state;

module.exports = state;

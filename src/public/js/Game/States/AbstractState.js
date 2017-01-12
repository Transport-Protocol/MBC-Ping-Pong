var state = function (game) {
  this.addPlayer = function () {
    console.log("addPlayer is not allowed in current state: " + this.game.state.current)
  };
  this.removePlayer = function (playerId) {
    console.log("removePlayer is not allowed in current state: " + this.game.state.current)
  };
  this.timeout = function (playerId) {
    console.log("timeout is not allowed in current state: " + this.game.state.current)
  };

};

module.exports = state;

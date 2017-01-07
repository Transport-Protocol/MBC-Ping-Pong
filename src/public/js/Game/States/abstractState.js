
var state = function(game){
  this.addPlayer = function(){
    console.log("addPlayer is not allowed in currrent state: " + this.game.state.current)
  };
  this.removePlayer = function(playerId){
    console.log("removePlayer is not allowed in currrent state: " + this.game.state.current)
  };

};

module.exports = state;

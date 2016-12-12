var commHandler = require('./DisplayPeerCommunicationHandler');
var Game = require('./Game.js')

// Example of a exported function call
//commHandler.initPlayer();

commHandler.init();

window.addTestPlayer = function(){
  var player = Game.addPlayerToGame();
  var x = 0;
  var y = 0;


  if(player !== undefined){
    var interval = setInterval(
      function(){
        Game.addPositionToPlayerBuffer(player, x++, y++);
      },
      500
    );
  }

  this.removeTestPlayer = function(){
    clearInterval(interval);
    Game.removePlayerFromGame(player);
  }
}

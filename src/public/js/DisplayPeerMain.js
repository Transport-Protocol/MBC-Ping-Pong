//var commHandler = require('./DisplayPeerCommunicationHandler');
var Game = require('./Game.js')

// Example of a exported function call
//commHandler.initPlayer();

window.addTestPlayer = function(){
  var player = Game.addPlayerToGame();
  var x = 0;
  var y = 0;


  console.log(player);
  setInterval(
    function(){
      player.addPositionToBuffer(x++, y++);
    },
    500
  )
}

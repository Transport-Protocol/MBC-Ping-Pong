var FingerPositionHandler = require('./FingerPositionHandler.js');
var ControlPeerCommunicationHandler = require('./ControlPeerCommunicationHandler.js');

//@FIXME at the moment its assumed, there is no other argument then gameID. This will, when there is more than 1 argument.
ControlPeerCommunicationHandler.init(window.location.hash.substr(8));

var fingerPositionHandler = new FingerPositionHandler(
  "touchInput",
  40,
  [function(x,y){
    document.getElementById("mousePosition").innerHTML = "x= " + x + "y= " + y;
  },
  ControlPeerCommunicationHandler.sendPosition]
);

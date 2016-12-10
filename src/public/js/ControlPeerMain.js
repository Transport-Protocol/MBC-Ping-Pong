var FingerPositionHandler = require('./FingerPositionHandler.js');
var ControlPeerCommunicationHandler = require('./ControlPeerCommunicationHandler.js');

var fingerPositionHandler = new FingerPositionHandler(
  "touchInput",
  40,
  [function(x,y){
    document.getElementById("mousePosition").innerHTML = "x= " + x + "y= " + y;
  }]
);

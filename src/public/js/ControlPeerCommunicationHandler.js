/*
*   Handler for Communication from and to the Control Peer.
*   The Control Peer represents the Player.
*
*   For further information:
*
*   Sequence including this Entity:
*   https://raw.githubusercontent.com/Transport-Protocol/MBC-Ping-Pong
*   /master/docu/maindocumentation/architecture/prototypSequenceDiagram.png
*
*   Section in documentation:
*   Chapter: Architecture
*   Section: Prototyp
*/

var io = require('socket.io-client');
var sigClient = require('./../../own_modules/WebRTC-COMM.js').Client;

//Interface
module.exports.init = init;
module.exports.sendPosition = sendPosition;

var opts = { "mode": "single" };

// Predefined vars used in init
var iosocket;
var client;

// Statecheck replacers
// @TODO replace with states
var isPeer2Peer = false;
var isConnected = false;

// @TODO check for name collision 'init'
function init(){
    initCommunication();
}

function initCommunication(){
    
    iosocket = io.connect();
    
    iosocket.on('connect', function(){
        console.log("Now Connected to the Server.");
        
        if( !isConnected ) {
            client = new sigClient(iosocket, opts, "testroom", null);
        }
        
        isConnected = true;
    });
}



function sendPosition(posx, posy){ 
    console.log("Sending new Position: ["+posx+","+posy+"]");

    var position = { posX: posx, posY: posy };

    client.sendMessage("changeposition", JSON.stringify(position));
}

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

var P2P = require('socket.io-p2p');
var io = require('socket.io-client');
var opts = { autoUpgrade: false, peerOpts: {numClients: 10} };

// Predefined vars used in init
var iosocket;
var p2psocket;

// Statecheck replacers
// @TODO replace with states
var isConnected = false;
var isPeer2Peer = false;

// @TODO check for name collision 'init'
function init(){
    initCommunication();
}

function initCommunication(){
    iosocket = io.connect();
    p2psocket = new P2P(iosocket, opts, null);
    
    iosocket.on('connect', function(){
        console.log("Now Connected to the Server.");
        isConnected = true;
    });
    
    p2psocket.on('ready', function(){});
    
    p2psocket.on('upgradewebrtc', function(){
        if(isPeer2Peer) return;
        
        p2psocket.upgrade();
        isPeer2Peer = true;
    });
}

function sendPosition(posx, posy){
    if(!isConnected || !isPeer2Peeer) return;
    
    console.log("Sending new Position: ["+posx+","+posy+"]");
    
    var position = {PlayerId: "someID", X: posx, Y: posy};
    p2psocket.emit('changeposition', position);
}
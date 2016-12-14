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
var Peer = require('simple-peer');

//Interface
module.exports.init = init;
module.exports.sendPosition = sendPosition;

var opts = { autoUpgrade: false, peerOpts: {trickle: false, numClients: 25} };

// Predefined vars used in init
var iosocket;
var p2psocket;

// Statecheck replacers
// @TODO replace with states
var isConnected = false;
var isPeer2Peer = false;

Peer.config = {
    iceServers: [
        {
        urls: 'stun:stun.l.google.com:19302',
        urls: 'stun:stun2.l.google.com:19302',
        urls: 'stun:stun3.l.google.com:19302',
        urls: 'stun:stun4.l.google.com:19302',
        urls: 'stun:stunserver.org:3478'
        }
    ]
};

// @TODO check for name collision 'init'
function init(){
    initCommunication();
}

function initCommunication(){
    iosocket = io.connect();
    p2psocket = new P2P(iosocket, opts, function(){
        p2psocket.emit('peer-obj', "Hello");
    });

    iosocket.on('connect', function(){
        console.log("Now Connected to the Server.");
        console.log(p2psocket);
        isConnected = true;
        p2psocket.emit("joinroom", {roomname: "testroom"});
    });

    p2psocket.on('ready', function(){});

    p2psocket.on('upgradewebrtc', function(){
        if(p2psocket.usePeerConnection == true) return;
        console.log("Now upgrading.");
        p2psocket.upgrade();
        console.log(p2psocket);
    });
    
    p2psocket.on('playerdisconnected', function(data){  
        console.log("A Player disconnected :(");
    });
}

function sendPosition(posx, posy){
    //if(!isConnected || !isPeer2Peer) return;

    console.log("Sending new Position: ["+posx+","+posy+"]");

    var position = { playerId: p2psocket.peerId, X: posx, Y: posy };
    p2psocket.emit('changeposition', position);
}

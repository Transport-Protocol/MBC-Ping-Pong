/*
*   Handler for Communication from and to the Display Peer.
*   The Display Peer represents the Monitor.
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

// Interface
module.exports.init = init;
module.exports.addPositionToPlayerBufferListener = addPositionToPlayerBufferListener;
module.exports.addPlayerToGameListener = addPlayerToGameListener;
module.exports.removePlayerFromGameListener = removePlayerFromGameListener;

var opts = { autoUpgrade: false, peerOpts: {trickle: false, numClients: 25} };

// Predefined vars used in init
var ioSocket;
var p2psocket;

// Statecheck replacers
// @TODO replace with states
var isConnected = false;

// List of listener functions to call
var listener_addPosition = [];
var listener_remPlayer   = [];
var listener_single_addPlayer;

// List Object of all Connected players.
// Key: The peer id of the Players socket.
// Value: The player id the game has given.
var playerconn = {};

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

function init(){
    ioSocket = io.connect();
    p2psocket = new P2P(ioSocket, opts, function(){
        p2psocket.emit('peer-obj', "Hello");
    });

    ioSocket.on('connect', function(){
        console.log("Now Connected to the Server.");
        console.log(ioSocket);
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

    p2psocket.on('changeposition', function(data){
        console.log("User ["+ data.playerId +"] changed Position.");
        
        if(data.playerId in playerconn) {
            // Player exists
            addPos(data);
        }
        else {
            // Player doesn't exist
            // @TODO react to new Players dynamically
            var newId = addPlayer();
            playerconn[data.playerId] = newId;
            addPos(data);
            
            displayPlayers();
        }
    });

    p2psocket.on('peer-error', function(data){
        console.log(data);

        gotDisconnectedPlayer();
    });  

    p2psocket.on('playerdisconnected', function(data){  
        if(!data.peerId in playerconn) {
            console.log("Unknown Player disconnected.");
            return;
        }
        
        var playerId = playerconn[data.peerId];
        
        console.log("User <"+playerId+"> ["+ data.peerId +"] disconnected");
        
        gotDisconnectedPlayer(data);
        displayPlayers();
    });    
}

function displayPlayers(){
    for (var key in playerconn) {
        if (playerconn.hasOwnProperty(key)) {
            var obj = playerconn[key];
            console.log("ID: <" + obj + "> >> Peer: [" + key + "]");
        }
    }
}

function gotDisconnectedPlayer(data){   
    // Extract data from Object
    var playerid = playerconn[data.peerId];
    
    // Call all registered methods with given parameters
    listener_remPlayer.forEach(function(cb){
        cb(playerid);
    });
    
    // Delete Key of disconnected Player
    delete playerconn[data.peerId];
}

function addPos(position){
    if(!position.playerId in playerconn) return;
    
    // Extract data from Object
    var playerId = playerconn[position.playerId];
    var posX = position.X;
    var posY = position.Y;
    
    // Call all registered methods with given parameters
    listener_addPosition.forEach(function(cb){
        cb(playerId, posX, posY);
    });
}

function addPlayer(){
    return listener_single_addPlayer();
}

// EXPORTED
function addPositionToPlayerBufferListener(cb){
    listener_addPosition.push(cb);
}

// EXPORTED
function addPlayerToGameListener(cb) {
    listener_single_addPlayer = cb;
}

// EXPORTED
function removePlayerFromGameListener(cb){
    listener_remPlayer.push(cb);
}
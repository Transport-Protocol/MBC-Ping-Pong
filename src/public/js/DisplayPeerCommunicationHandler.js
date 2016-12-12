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

// Interface
module.exports.init = init;
module.exports.addPositionToPlayerBufferListener = addPos;
module.exports.addPlayerToGameListener = addPlayer;
module.exports.removePlayerFromGameListener = gotDisconnectedPlayer;

var opts = { autoUpgrade: false, peerOpts: {numClients: 10} };

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

var playerconn = [];

function init(){
    ioSocket = io.connect();
    p2psocket = new P2P(ioSocket, opts, null);

    ioSocket.on('connect', function(){
        console.log("Now Connected to the Server.");
        isConnected = true;
        p2psocket.emit("joinroom", {roomname: "testroom"});
    });

    p2psocket.on('ready', function(){});

    p2psocket.on('upgradewebrtc', function(){
        if(p2psocket.usePeerConnection == true) return;
        console.log("Now upgrading.");
        p2psocket.upgrade();
    });

    p2psocket.on('changeposition', function(data){
        console.log("Got change position.");
    });

    p2psocket.on('peer-error', function(data){
        console.log(data);
        playerconn.forEach(function(player){
        });
        gitDisconnectedPlayer();
    });    
}

function gotDisconnectedPlayer(data){
    // @TODO check for id
    if(!data.hasOwnProperty('id')) return;
    
    var playerid = data.id;
    
    listener_remPlayer.forEach(function(cb){
        cb(playerid);
    });
}

function addPos(){}

function addPlayer(){}
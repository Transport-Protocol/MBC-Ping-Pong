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

var io = require('socket.io-client');
var sigclient = require('./../../own_modules/WebRTC-COMM.js').Client;
var UUIDGEN = require('./../../own_modules/WebRTC-COMM.js').getID;

// Interface
module.exports.init = init;
module.exports.addPositionToPlayerBufferListener = addPositionToPlayerBufferListener;
module.exports.addPlayerToGameListener = addPlayerToGameListener;
module.exports.removePlayerFromGameListener = removePlayerFromGameListener;

var opts = { "mode":"multi", "maxpeers":999 };

// Predefined vars used in init
var ioSocket;
var client;

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


function init(){
    ioSocket = io.connect();
    
    var gameid = UUIDGEN();
    
    console.log("GAME ID: " + gameid);


    ioSocket.on('connect', function(){
        console.log("Now Connected to the Server.");

        if( !isConnected ) {
            client = new sigclient(ioSocket, opts, gameid, null);
            client.setNewConnectionCallback(gotNewConnection);
            client.setDisconnectCallback(gotDisconnectedPlayer);
            client.setMessageCallback(gotNewMessage);
        }
        
        isConnected = true;
    });
    
    return gameid;
}

function displayPlayers(){
    for (var key in playerconn) {
        if (playerconn.hasOwnProperty(key)) {
            var obj = playerconn[key];
            console.log("ID: <" + obj + "> >> Peer: [" + key + "]");
        }
    }
}

function gotNewConnection(peerid) {
    console.log("New Player connected [" + peerid + "]")
    
    var id = addPlayer();
    
    playerconn[peerid] = id;
    
    displayPlayers();
}

function gotNewMessage(type, peerid, message) {
    console.log("type: " + type);
    console.log("from: " + peerid);
    
    if( type === "changeposition" ) {
        
        console.log("MSG: " + message);
        
        // Received a position change
        if( playerconn.hasOwnProperty(peerid) ) {
            
            var id = playerconn[peerid];
            
            addPos(id, message.posX, message.posY);
            
            console.log("User ["+ peerid +"] changed Position.");
        } else {
            
            // @TODO for testing purpose, states seem weird and undefined
            gotNewConnection(peerid);
            
            var id = playerconn[peerid];
            
            addPos(id, message.posX, message.posY);
            
            console.log("User ["+ peerid +"] changed Position.");
        }
    }
}

function gotDisconnectedPlayer(peerid){   
    // Extract data from Object
    var playerid = playerconn[peerid];
    
    // Call all registered methods with given parameters
    listener_remPlayer.forEach(function(cb){
        cb(playerid);
    });
    
    // Delete Key of disconnected Player
    delete playerconn[peerid];
}

function addPos(playerId, posX, posY){
    // if( playerId in playerconn ) return;
    
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
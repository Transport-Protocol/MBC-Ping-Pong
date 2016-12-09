/*
*   This file needs to be "Browserified".
*   Install: "npm install --global browserify"
*   Run: "browserify [PATH]/testWebRTCCLient_RAW.js -o [PATH]/testWebRTCClient_Bundle.js"
*/

var P2P = require('socket.io-p2p');
var io = require('socket.io-client');
var iosocket = io.connect();
var p2psocket = new P2P(iosocket, {}, null);

var connected = false;

var btn_connect = document.getElementById('connect');
var btn_sendping = document.getElementById('sendping');
var btn_toggletec = document.getElementById('toggletec');
var fld_room = document.getElementById('roomfield');

// Called automatically when connection is established
iosocket.on('connect', function(){
    console.log("Socket is connected.");
});

// Called automatically when connection over p2psock ready
// @TODO Was never called, misinterpretation?
p2psocket.on('ready', function(){
    console.log("P2P Socket ready.");
});

// Add Event Listeners for buttons
btn_connect.addEventListener('click', connecttomonitor);
btn_sendping.addEventListener('click', sendping);
btn_toggletec.addEventListener('click', toggletec);

// Connect to a room on the Server
// Later used to upgrade all users of that room to WebRTC
// Monitor should create room and player should join
function connecttomonitor(){
    console.log("Connect pressed.");
    var roomname = fld_room.value;
    p2psocket.emit("joinroom", {roomname: roomname});
}

// Simple ping
function sendping(){
    console.log("Send Ping pressed.");
    p2psocket.emit("ping");
}

// Later for variable up-/downgrade of connection
// WebSocket <-> WebRTC
function toggletec(){
    console.log("Toggle Technology pressed.");
    p2psocket.emit("toggletec");
}
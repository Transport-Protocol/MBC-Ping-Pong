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

iosocket.on('connect', function(){
    console.log("Socket is connected.");
});

p2psocket.on('ready', function(){
    console.log("P2P Socket ready.");
});

btn_connect.addEventListener('click', connecttomonitor);
btn_sendping.addEventListener('click', sendping);
btn_toggletec.addEventListener('click', toggletec);

function connecttomonitor(){
    console.log("Connect pressed.");
    var roomname = fld_room.value;
    p2psocket.emit("joinroom", {roomname: roomname});
}

function sendping(){
    console.log("Send Ping pressed.");
    p2psocket.emit("ping");
}

function toggletec(){
    console.log("Toggle Technology pressed.");
    p2psocket.emit("toggletec");
}
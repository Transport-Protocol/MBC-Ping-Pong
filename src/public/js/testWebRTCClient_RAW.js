/*
*   This file needs to be "Browserified".
*   Install: "npm install --global browserify"
*   Run: "browserify [PATH]/testWebRTCCLient_RAW.js -o [PATH]/testWebRTCClient_Bundle.js"
*/

var io = require('socket.io-client');
var sigclient = require('./../../own_modules/WebRTC-COMM.js').Client;
var iosocket = io.connect();

var connected = false;
var connobj;

var btn_connect = document.getElementById('connect');
var btn_sendping = document.getElementById('sendping');
var btn_toggletec = document.getElementById('toggletec');
var fld_room = document.getElementById('roomfield');

// Called automatically when connection is established
iosocket.on('connect', function(){
    console.log("Socket is connected.");
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
    
    connobj = new sigclient(iosocket, {}, "testroom", null);
}

// Simple ping
function sendping(){
    console.log("Send Ping pressed.");
    connobj.sendMessage("nothing", "hallo");
}

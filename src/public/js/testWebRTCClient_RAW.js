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

var btn_connect_single = document.getElementById('connect_single');
var btn_connect_multi = document.getElementById('connect_multi');
var btn_sendping = document.getElementById('sendping');
var btn_toggletec = document.getElementById('toggletec');
var fld_room = document.getElementById('roomfield');

// Called automatically when connection is established
iosocket.on('connect', function(){
    console.log("Socket is connected.");
});



// Add Event Listeners for buttons
btn_connect_single.addEventListener('click', connecttomonitor_single);
btn_connect_multi.addEventListener('click', connecttomonitor_multi);
btn_sendping.addEventListener('click', sendping);
btn_toggletec.addEventListener('click', toggletec);

// Connect to a room on the Server
// Later used to upgrade all users of that room to WebRTC
// Monitor should create room and player should join
function connecttomonitor_single(){
    console.log("Connect pressed.");
    
    connobj = new sigclient(iosocket, {}, "testroom", null);
}

function connecttomonitor_multi(){
    console.log("Connect pressed.");
    
    connobj = new sigclient(iosocket, {"mode":"multi", "maxpeers":999}, "testroom", null);
}

// Simple ping
function sendping(){
    console.log("Send Ping pressed.");
    connobj.sendMessage("nothing", "hallo");
}

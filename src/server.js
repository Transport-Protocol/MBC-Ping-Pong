var express = require('express')
,   app = express()
,   server = require('http').createServer(app)
,   config = require('./config.json')
,   io = require('socket.io')(server)
,   sigserver = require('./own_modules/WebRTC-COMM.js').Server
,   sigserverrooms = require('./own_modules/WebRTC-COMM.js').ServerRooms;

// Give each new User a better readable id for logging
var nextID = 1;
var allUsers = [];

// List of all game-rooms, most likely one per monitor
// @TODO need generation of rooms by monitor
var rooms = [{ 
  users: [], 
  userCount: 0, 
  state: 'idle', 
  name: 'testroom'
}];

server.listen(config.port);

app.use('/' ,express.static('public/'));
app.use('/node_modules', express.static('node_modules/'));

console.log(rooms);
console.log(sigserverrooms);

app.get('/', function(req, res) {
    res.sendfile('public/index.html');
});

// Connection is called upon client connection
io.on('connection', function(socket){

    new sigserver(socket, {});


    // This function is only needed as backup if 
    // no ICE candidates can be found :(
    socket.on('changeposition', function(data){
        console.log("Got <changeposition> from user.");
        room.users.forEach(function(user){
            user.emit('changeposition', data);
        });
    });
    
    
});

var express = require('express')
,   app = express()
,   server = require('http').createServer(app)
,   config = require('./config.json')
,   io = require('socket.io')(server)
,   p2p = require('./changed_node_modules/socket.io-p2p-server-fix/index.js').Server
,   p2pclients = require('./changed_node_modules/socket.io-p2p-server-fix/index.js').clients;

// List of all game-rooms, most likely one per monitor
// @TODO need generation of rooms by monitor
var rooms = [ {users: [], userCount: 0, state: 'idle', name: 'testroom'} ];

server.listen(config.port);

app.use('/' ,express.static('public/'));
app.use('/node_modules', express.static('node_modules/'));

// WebSocket should use P2P interface to handle connectiondata
io.use(p2p);

console.log(rooms);

app.get('/', function(req, res) {
    res.sendfile('public/index.html');
});

// Connection is called upon client connection
io.on('connection', function(socket){
    console.log("Some user connected.");
    
    var room = "";
    
    // Disconnect is called upton client disconnection
    socket.on('disconnect', function(){
        console.log("User disconnected.");
        if(room !== "") {
            // Remove Client Socket data from room
            room.users.splice(room.users.indexOf(socket), 1);
        }
    });
    
    // Client wants to join a room
    socket.on('joinroom', function(data){
        console.log("User wants to join room <" + data.roomname + ">");
        
        // Give default room
        // @TODO check for room specified by client to exist
        room = rooms[0];
        
        // Join room
        socket.join(room.name);
        
        // Update room data
        room.users.push(socket);
        room.usercount++;
        
        // Create a new information entity for P2P handling
        // This will hold information regarding all peers in one room
        // to allow them to upgrade to WebRTC only with those in the room
        p2p(socket, null, room);
        
        // Ping handle, ack to others in the same room
        socket.on('ping', function(data){
            console.log("User send Ping.");
            var otherUsers = room.users.filter(function(user){
                return user !== socket;
            });
        
            otherUsers.forEach(function(user){
                user.emit('ping', data);
           });
        });
    });
    
    
});

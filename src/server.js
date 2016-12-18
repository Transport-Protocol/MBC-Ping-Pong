var express = require('express')
,   app = express()
,   server = require('http').createServer(app)
,   config = require('./config.json')
,   io = require('socket.io')(server)
,   p2p = require('./changed_node_modules/socket.io-p2p-server-fix/index.js').Server
,   p2pclients = require('./changed_node_modules/socket.io-p2p-server-fix/index.js').clients;

// Give each new User a better readable id for logging
var nextID = 1;
var allUsers = [];

// List of all game-rooms, most likely one per monitor
// @TODO need generation of rooms by monitor
var rooms = [{ 
                users: [], 
                userCount: 0, 
                state: 'idle', 
                name: 'Technical-Demonstrator'
            }];

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
    var userID = socket.id;
    allUsers[userID] = nextID;
    nextID++;
    
    console.log("User <"+ allUsers[userID] +">[ "+ userID +" ] connected.");
    
    var room = undefined;
    
    // Disconnect is called upton client disconnection
    socket.on('disconnect', function(){
        console.log("User <"+ allUsers[userID] +">[ "+ userID +" ] disconnected.");
        if(room !== undefined) {
            // Remove Client Socket data from room
            room.users.splice(room.users.indexOf(socket), 1);
            room.users.forEach(function(user){
                user.emit("playerdisconnected", {peerId: userID});
            });
        }
    });
    
    // Client wants to join a room
    socket.on('joinroom', function(data){
        if(room !== undefined) {
            console.log("User already in a room.");
            return;
        }
        console.log("User <"+ allUsers[userID] +">[ "+ userID +" ] wants to join room <" + data.roomname + ">");
        
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
    });
    
    // Ping handle, ack to others in the same room
    socket.on('userping', function(data){
        if(room === undefined) {
            console.log("User send Ping but in no room.");
            return;
        }
        console.log("User send Ping.");
        var otherUsers = room.users.filter(function(user){
            return user !== socket;
        });

        otherUsers.forEach(function(user){
            user.emit('userping', data);
       });
    });
    
    socket.on('toggletec', function(data){
        console.log("User upgrading to WebRTC.");
        room.users.forEach(function(user){
            user.emit('upgradewebrtc', data);
        });
    });
    
    // This function is only needed as backup if 
    // no ICE candidates can be found :(
    socket.on('changeposition', function(data){
        console.log("Got <changeposition> from user.");
        room.users.forEach(function(user){
            user.emit('changeposition', data);
        });
    });
    
    
});

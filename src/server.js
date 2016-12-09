var express = require('express')
,   app = express()
,   server = require('http').createServer(app)
,   config = require('./config.json')
,   io = require('socket.io')(server)
,   p2p = require('./changed_node_modules/socket.io-p2p-server-fix/index.js').Server
,   p2pclients = require('./changed_node_modules/socket.io-p2p-server-fix/index.js').clients;

var rooms = [ {users: [], userCount: 0, state: 'idle', name: 'testroom'} ];

server.listen(config.port);

app.use('/' ,express.static('public/'));
app.use('/node_modules', express.static('node_modules/'));

io.use(p2p);

console.log(rooms);

app.get('/', function(req, res) {
    res.sendfile('public/index.html');
});

io.on('connection', function(socket){
    console.log("Some user connected.");
    
    var room = "";
    
    socket.on('disconnect', function(){
        console.log("User disconnected.");
        if(room !== "") {
            room.users.splice(room.users.indexOf(socket), 1);
        }
    });
    
    socket.on('joinroom', function(data){
        console.log("User wants to join room <" + data.roomname + ">");
        room = rooms[0];
        socket.join(room.name);
        room.users.push(socket);
        room.usercount++;
        
        p2p(socket, null, room);
        
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

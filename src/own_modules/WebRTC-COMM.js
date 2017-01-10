module.exports.Client = Client;
module.exports.Server = Server;
module.exports.ServerRooms = rooms;
module.exports.getID = getUUID;


var rtcconfig = {
	'iceServers': [
        //{ 'urls': 'stun:stun.l.google.com:19302' },
        { 'urls': 'stun:stun1.l.google.com:19305' },
        { 'urls': 'stun:stun2.l.google.com:19305' },
        { 'urls': 'stun:stun3.l.google.com:19305' },
        { 'urls': 'stun:stun4.l.google.com:19305' },
        { 'urls': 'stun:stun.schlung.de' }
    ]
};

var dataChannelOptions = {
	ordered: false,
	maxRetransmitTime: 1000
};

function Client(iosocket, config, room, signallingCallback) {
    
    // @TODO try reproduce socket.io timing problems by removing this.
    sleep(100);
    
    // Scope helper
    var self = this;
  
    self.iosocket = iosocket;

    
    /*
    * Overload RTCPeerConnection and RTCSessionDescription
    * to support Browsers that have not prefixed this.
    */
    self.peerConnection = window.RTCPeerConnection || 
                          window.mozRTCPeerConnection || 
                          window.webkitRTCPeerConnection || 
                          window.msRTCPeerConnection;

    self.sessionDesc    = window.RTCSessionDescription || 
                          window.mozRTCSessionDescription ||
                          window.webkitRTCSessionDescription || 
                          window.msRTCSessionDescription;

    
    
    // Own ID
    self.id = self.iosocket.id;
    
    // Number of connected Peers (WebRTC)
    self.connectioncount = 0;

    // Object containing all connections
    self.rtcPeerConnections = {};

    // Callback when reveiving a message on the DataChannel
    self.messageCallback = null;
    
    // Callback when a new Connection has been established
    self.newConnectionCallback = null;
    
    // Callback when a Peer has been disconnected
    self.disconnectCallback = null;


    // Set Client Config
    if( config ) {
        self.mode     = config.hasOwnProperty('mode') ? config.mode : 'single';
        self.maxpeers = config.hasOwnProperty('maxpeers') ? config.mode : 1;
    } else {
        self.mode = 'single';
        self.maxpeers = 1;
    }

    
    // Check Client Config <mode:maxpeers>
    if( self.mode === 'single' ) {
        
        // Mode is Single
        if( self.maxpeers != 1 ) {
            
            // ERROR: maxpeers in single has to be 1
            console.log("ERROR: maxpeers in single has to be 1");
        }
    } else if( self.mode === 'multi' ) {
        
        // Mode is Multi
        if( self.maxpeers < 2 ) {
            
            // ERROR: maxpeers in multi has to be bigger than 1
            console.log("ERROR: maxpeers in multi has to be bigger than 1");
        }
    } else if( clientConfig.mode.indexOf(self.mode) === -1 ) {
        
        // ERROR: unknown mode specified
        console.log("ERROR: unknown mode specified");
    } else {
        
        // ERROR: unknown error
        console.log("ERROR: unknown error");
    }

    // @TODO replace by Logging
    console.log("I AM: " + self.iosocket.id);
  
  
    self.iosocket.on('signalling_message', function(data) {
        console.log("new signal => " + JSON.stringify(data));
        
        // Start Setting up connection after at least one other Peer 
        // is connected to the Server.
        // @IMPORTANT We receive only Signallin messages from OTHER Peers
        // newConnection();
    
        if( data.type === 'hereandready' ) {
            
            // New User Connected to game <init>
            // @TODO handle multiple users in Multi mode
            console.log("New User connected.");
            
            var newUserID = data.from;
            
            newConnection(newUserID);
        } else if( data.type === 'peer_disconnect' && self.mode === 'multi' ) {
            
            // A Peer has been disconnected
            var disconnectedPeerId = data.from;
            peerDisconnected(disconnectedPeerId);
        } else if( data.type === 'host_disconnect' && self.mode === 'single' ) {
            
            // Connection to host peer has been lost
            var disconnectedPeerId = data.from;
            hostDisconnected(disconnectedPeerId);
        } else {
            
            if( self.mode === 'single' && self.connectioncount == 0) {
                
                // First Signal, need setup
                newConnection(data.from);
            }
            
            // Connection Controlling Signal
            var message = JSON.parse(data.message);
            
            if( message.sdp ) {
                
                /*
                if( (self.mode === "multi" && self.rtcPeerConnections[""+data.from].sdpdone) ||
                    (self.mode === "single" && self.rtcPeerConnections[0].sdpdone)) return;
                */
                
                // SDP
                gotSDP(message, data.from);
            } else if( message.candidate){
                
                // ICE CANDIDATE
                addCandidate(message, data.from);
            } else {
                
                // ERROR: Unknown Singal
                // @TODO handle Errors properly, use log?!
                console.log("Unknown Signal: " + JSON.stringify(message));
            }
        }
      });
    
    // Send initial Signal to Server
    // If Mode id Multi, this signal will be received by no one
    // @TODO refactor this!
    // If Mode is Single, the signal will be redirected to the Multi-Peer
    self.iosocket.emit('signal', {"type":"hereandready", "mode":self.mode, "room":"testroom"});
  
    function peerDisconnected(peerid) {
        if( !self.rtcPeerConnections[peerid] ) return;
        
        var connobj = self.rtcPeerConnections[peerid];

        connobj.connection.close();
        
        delete self.rtcPeerConnections[peerid];
        
        if( self.disconnectCallback ) {
            self.disconnectCallback(peerid);
        }
    };
    
    function hostDisconnected(peerid) {
        if( !self.rtcPeerConnections[0] ) return;
        
        var connobj = self.rtcPeerConnections[0];

        connobj.connection.close();
        
        delete self.rtcPeerConnections[0];
        
        if( self.disconnectCallback ) {
            self.disconnectCallback(peerid);
        }
    };
  
    // @IMPORTANT @TODO refactor this. Chaotic Callback Hell...
    function gotSDP(message, peerid) {
        console.log("Got SDP Message.");
      
        if( self.mode === 'single' ) {
            
            // Only one Connection in Single Mode
            var connobj = self.rtcPeerConnections[0];
            
            connobj.sdpdone = true;
            
            // Set Remote Description
            var promise = connobj.connection.setRemoteDescription(
                // Add SDP information from Remote to init new SessionDescription
                new self.sessionDesc(message.sdp), 
                function() {
                    // Answer to any offer in this Session
                    if( connobj.connection.remoteDescription.type == 'offer' ) {
                        
                        // Create Answer to offer
                        connobj.connection.createAnswer(
                            function(desc) {
                                connobj.connection.setLocalDescription(desc, 
                                    function() {
                                        console.log("Sending local description");
                                        /*
                                        // Emit Answer
                                        self.iosocket.emit('signal', {
                                            "type":"SDP", 
                                            "to":peerid,
                                            "message": JSON.stringify({
                                              'sdp': connobj.connection.localDescription 
                                            }), 
                                            "room":"testroom"});
                                        */
                                    }, 
                                    function(errormsg) {
                                        
                                        // @TODO replace Error Handling
                                        console.log("" + errormsg);
                                    }
                                );
                            }, 
                            function(errormsg) {
                                
                                // @TODO replace Error Handling
                                console.log("" + errormsg);
                            }
                        );
                    }
                },
                function(){}
            );
        } else {
            
            // Mode is Multi
            if( !self.rtcPeerConnections.hasOwnProperty(peerid) ) {
                
                // No Connectino initiated
                // @TODO Error
                return;
            }
            
            // Get right connection based on peerid
            var connobj = self.rtcPeerConnections[peerid];
            
            connobj.sdpdone = true;
            
            // Set Remote Description
            var promise = connobj.connection.setRemoteDescription(
                // Add SDP information from Remote to init new SessionDescription
                new RTCSessionDescription(message.sdp), 
                function() {
                    // Answer to any offer in this Session
                    if( connobj.connection.remoteDescription.type == 'offer' ) {
                        
                        // Create Answer to offer
                        connobj.connection.createAnswer(
                            function(desc) {
                                connobj.connection.setLocalDescription(desc, 
                                    function() {
                                        console.log("Sending local description");
                                        
                                        /*
                                        // Emit Answer
                                        self.iosocket.emit('signal', {
                                            "type":"SDP", 
                                            "to":peerid,
                                            "message": JSON.stringify({
                                              'sdp': connobj.connection.localDescription 
                                            }), 
                                            "room":"testroom"});
                                        */
                                    }, 
                                    function(errormsg) {
                                        
                                        // @TODO replace Error Handling
                                        console.log("" + errormsg);
                                    }
                                );
                            }, 
                            function(errormsg) {
                                
                                // @TODO replace Error Handling
                                console.log("" + errormsg);
                            }
                        );
                    }
                },
                function(){}
            );
            
            /*
            connobj.candidates.forEach(function(message) {
                // Add ICE Candidate from Signalling Message
                connobj.connection.addIceCandidate(new RTCIceCandidate(message.candidate));
            });
            
            connobj.candidates = [];
            */
        }
    }
  
    function addCandidate(message, peerid) {
        console.log("Adding ICE-Candidate")
      
        if( self.mode === 'single' ) {
            
            // Only one Connection in Single Mode
            var connobj = self.rtcPeerConnections[0];
          
            if( !connobj.sdpdone ) {
                connobj.candidates.push(message);
                return;
            }
          
            // Add ICE Candidate from Signalling Message
            connobj.connection.addIceCandidate(new RTCIceCandidate(message.candidate));
        } else {
            
            if( !self.rtcPeerConnections.hasOwnProperty(peerid) ) {
                
                // No Connectino initiated
                // @TODO Error
                return;
            }
            
            // Get right connection based on peerid
            var connobj = self.rtcPeerConnections[peerid];
          
            if( !connobj.sdpdone ) {
                connobj.candidates.push(message);
                return;
            }
          
            // Add ICE Candidate from Signalling Message
            connobj.connection.addIceCandidate(new RTCIceCandidate(message.candidate));
        }
    }
  
    function newConnection(peerid) {
        if( self.mode === 'single' && self.connectioncount == 0) {
            
            // @TODO replace by better checks
            self.connectioncount++;
            
            // Mode is SINGLE
            console.log("Mode is single");

            // Create empty Object
            // @TODO replace by own connection Class
            self.rtcPeerConnections[0] = { "connection":null, "datachannel":null, "sdpdone":false, "candidates":[] };
            var connobj = self.rtcPeerConnections[0];

            // Create new RTCPeerConnection und Datachannel
            connobj.connection = new self.peerConnection(rtcconfig);
            connobj.datachannel = connobj.connection.createDataChannel('textMessages', dataChannelOptions);

            // Check Connection Updates
            // @TODO Deprecated?
            connobj.connection.onconnectionstatechange = function(data) {
                console.log("Connection state changed.");
                
                switch( connobj.connection.connectionState ) {
                    case "connected": 
                        console.log("Successfully connected via WebRTC!");
                        peerconnected(peerid);
                        break;
                    
                    case "disconnected": 
                        console.log("Disconnected from other Peer!");
                        peerdisconnected(peerid);
                        break;
                    
                    case "failed": 
                        console.log("Could not establish a WebRTC connection!");
                        break;
                }
            };
            
            connobj.connection.oniceconnectionstatechange = function(data) {
                var state = connobj.connection.iceConnectionState;
                
                console.log("Connection state changed. <" + state + ">");

                switch( state ) {
                    case "connected": 
                        console.log("Successfully connected via WebRTC!");
                        peerconnected(peerid);
                        break;
                    
                    case "disconnected": 
                        console.log("Disconnected from other Peer!");
                        peerdisconnected(peerid);
                        break;
                    
                    case "failed": 
                        console.log("Could not establish a WebRTC connection!");
                        break;
                }
            };
            
            // DataChannel open
            connobj.datachannel.onopen = function() {
                // DataChannel state changed
        
                if( connobj.datachannel.readyState === 'open' ) {
                    
                    // DataChannel now open
          
                    connobj.datachannel.onmessage = function(message) {
                    
                        //Received new message <WebRTC>
                        console.log("Datachannel: " + message.data);
            
                        if( self.messageCallback ) {
                            // Callback for messages
                            self.messageCallback(message.data.type, message.data.from, message.data.message);
                        }
                    };
                }
            };
      
            // DataChannel received
            connobj.connection.ondatachannel = function(data) {
                
                connobj.datachannel = data.channel;
        
                connobj.datachannel.onmessage = function(message) {
                    
                    //Received new message <WebRTC>
                    console.log("Datachannel: " + message.data);
            
                    if( self.messageCallback ) {
                        // Callback for messages
                        self.messageCallback(message.data.type, message.data.from, message.data.message);
                    }
                };
            };
            
            
      
            // Send ICE-Candidates to the Server
            connobj.connection.onicecandidate = function(data) {
                if( data.candidate ) {
                    // iosocket.emit('signal', {"type":"ice candidate", "to":peerid, "message": JSON.stringify({'candidate': data.candidate}), "room":"testroom"});
                    console.log("Candidate: " + data.candidate);
                } else {
                    var desc = connobj.connection.localDescription;
                    
                    self.iosocket.emit('signal', {"type":"SDP", "to":peerid, "message": JSON.stringify({'sdp': desc }), "room":"testroom"});
                }
            };

            // Negotiationneeded
            connobj.connection.onnegotiationneeded = function() {
                console.log("Negotiaton needed.");
                connobj.connection.createOffer(
                    function(desc) {
                        connobj.connection.setLocalDescription(desc, function() {
                            console.log("Sending local description");
                            self.iosocket.emit('signal', {"type":"SDP", "to":peerid, "message": JSON.stringify({'sdp': connobj.connection.localDescription }), "room":"testroom"});
                        }, function(errormsg) {
                            console.log("" + errormsg);
                        }
                        );
                    }, function(errormsg) {
                        console.log("" + errormsg);
                    }
                );
            };
        } else {
            
            if( self.rtcPeerConnections.hasOwnProperty(peerid) ) {
                
                // Connection to Peer already exists
                return;
            }
            
            self.connectioncount++;

            // Mode is MULTI
            console.log("Mode is Multi");
            
            // Create empty Object
            // @TODO replace by own connection Class
            self.rtcPeerConnections[""+peerid] = { "connection":null, "datachannel":null, "sdpdone":false, "candidates":[] };
            var connobj = self.rtcPeerConnections[""+peerid];

            // Create new RTCPeerConnection und Datachannel
            connobj.connection = new self.peerConnection(rtcconfig);
            connobj.datachannel = connobj.connection.createDataChannel('textMessages', dataChannelOptions);
            
            // Check Connection Updates
            // @TODO Deprecated?
            connobj.connection.onconnectionstatechange = function(data) {               
                console.log("Connection state changed.");
                
                switch( connobj.connection.connectionState ) {
                    case "connected": 
                        console.log("Successfully connected via WebRTC!");
                        peerconnected(peerid);
                        break;
                    
                    case "disconnected": 
                        console.log("Disconnected from other Peer!");
                        peerdisconnected(peerid);
                        break;
                    
                    case "failed": 
                        console.log("Could not establish a WebRTC connection!");
                        break;
                }
            };
            
            connobj.connection.oniceconnectionstatechange = function(data) {
                var state = connobj.connection.iceConnectionState;
                
                console.log("Connection state changed. <" + state + ">");
                
                switch( state ) {
                    case "connected": 
                        console.log("Successfully connected via WebRTC!");
                        peerconnected(peerid);
                        break;
                    
                    case "disconnected": 
                        console.log("Disconnected from other Peer!");
                        peerdisconnected(peerid);
                        break;
                    
                    case "failed": 
                        console.log("Could not establish a WebRTC connection!");
                        break;
                }
            };
            
            // DataChannel open
            connobj.datachannel.onopen = function() {
                // DataChannel state changed
        
                if( connobj.datachannel.readyState === 'open' ) {
                    
                    // DataChannel now open
                    connobj.datachannel.onmessage = function(message) {
                    
                        //Received new message <WebRTC>
                        console.log("Datachannel: " + message.data);
            
                        if( self.messageCallback ) {
                            var msg = JSON.parse(message.data);
                        self.messageCallback(msg.type, msg.from, JSON.parse(msg.message));
                        }
                    };
                }
            };
            
            // DataChannel received
            connobj.connection.ondatachannel = function(data) {
                
                connobj.datachannel = data.channel;
        
                connobj.datachannel.onmessage = function(message) {
                    
                    //Received new message <WebRTC>
                    console.log("Datachannel: " + message.data);
            
                    if( self.messageCallback ) {
                        // Callback for messages
                        var msg = JSON.parse(message.data);
                        self.messageCallback(msg.type, msg.from, JSON.parse(msg.message));
                    }
                };
            };
            
            // Send ICE-Candidates to the Server
            connobj.connection.onicecandidate = function(data) {
                if( data.candidate ) {
                    // iosocket.emit('signal', {"type":"ice candidate", "to":peerid, "message": JSON.stringify({'candidate': data.candidate}), "room":"testroom"});
                    console.log("Candidate: " + data.candidate);
                } else {
                    var desc = connobj.connection.localDescription;
                    
                    self.iosocket.emit('signal', {"type":"SDP", "to":peerid, "message": JSON.stringify({'sdp': desc }), "room":"testroom"});
                }
            };
            
            // Negotiationneeded
            connobj.connection.onnegotiationneeded = function() {
                console.log("Negotiaton needed.");
                connobj.connection.createOffer(
                    function(desc) {
                        connobj.connection.setLocalDescription(desc, function() {
                            console.log("Sending local description");
                            // self.iosocket.emit('signal', {"type":"SDP", "to":peerid, "message": JSON.stringify({'sdp': connobj.connection.localDescription }), "room":"testroom"});
                        }, function(errormsg) {
                            console.log("" + errormsg);
                        }
                        );
                    }, function(errormsg) {
                        console.log("" + errormsg);
                    }
                );
            };
        }
    }
    
    function peerconnected(peerid) {
        // A new Peer has been successfully connected
        
        if( self.newConnectionCallback ) {
            self.newConnectionCallback(peerid);
        }
    }
    
    function peerdisconnected(peerid) {
        // A Peer connection has been disconnected
        
        if( self.disconnectCallback ) {
            self.disconnectCallback(peerid);
        }
    }
};

Client.prototype.setMessageCallback = function(newCallback) {
    this.messageCallback = newCallback;
};

Client.prototype.setNewConnectionCallback = function(newCallback) {
    this.newConnectionCallback = newCallback;
};

Client.prototype.setDisconnectCallback = function(newCallback) {
    this.disconnectCallback = newCallback;
};

Client.prototype.sendMessage = function(msgType, data) {
    var self = this;
    
    if( this.mode === 'single' ) {
        this.rtcPeerConnections[0].datachannel.send(JSON.stringify( { "type":msgType, "from":self.id, "message":data } ));
    } else {
        this.peers.forEach(function(conn) {
            self.rtcPeerConnections[""+conn].datachannel.send(JSON.stringify( { "type":msgType, "from":self.id, "message":data } ));
        });
    }
};

Client.prototype.changeRoom = function(newroom) {
    // @TODO WIP
};

Client.prototype.setSignallingCallback = function(newCallback) {
    // @TODO WIP
};




var rooms = {};

function Server(iosocket, config) {
    // Scope helper
    var self = this;
  
    // Socket from Socket.io
    self.iosocket = iosocket;
    
    // room
    self.room = "";
    
    // Mode
    self.mode = "";
    
    self.iosocket.on('disconnect', function(data) {
        console.log("Lost Connection to a Socket...");
        
        sendDisconnectSignal();
        leaveRoom();
    });
  
    self.iosocket.on('signal', function(req) {
        console.log(self.iosocket.id + " => " + JSON.stringify(req));  
       
        if( req.type === "hereandready" ) {
            if( !newPeer(req.room, req.mode) ) {
                
                // ERROR
                return;
            }
        }
    
        if( req.hasOwnProperty('to') ) {
            
            // @TODO replace direct Array indexing by Object-Named indexing for direct user access
            rooms[req.room].users.forEach(function(user) {
                if( user.id === req.to ) {
                    
                    // Send Signalling Message to single Peer
                    user.emit('signalling_message', {
                        from: self.iosocket.id,
                        type: req.type,
                        message: req.message
                    });
                }
            });
        } else {
    
            // No further defined target, send to Multi-Peer
            if( self.iosocket.id !== rooms[req.room].users[0].id ) {
                rooms[req.room].users[0].emit('signalling_message', {
                    from: self.iosocket.id,
                    type: req.type,
                    message: req.message
                });
            }
        }
    });
  
    function newPeer(room, mode){
        if( rooms.hasOwnProperty(room) ) {
            
            // Room exists, check if Single-Peer
            if( mode === 'single' ) {
                
                // All OK, connect to Room
                joinRoom(room);
                self.mode = 'single';
            } else {
                
                // Multiple Multi-Peers currently not supported in one room
                // @TODO ERROR
                console.log("Multi-Peer tried to join room with another Multi-Peer");
                return false;
            }
        } else {
            
            // Room doesnt exist
            if( mode === 'single' ) {
                
                // Singe-Peers can't create Rooms
                // @TODO ERROR
                console.log("Single-Peer tried to create Room.");
                return false;
            } else {
                
                // All OK, create Room
                createRoom(room);
                joinRoom(room);
                self.mode = 'multi';
            }
        }
        
        return true;
    };
    
    function createRoom(roomname) {
        
        console.log("New Room created: " + roomname);
        
        rooms[roomname] = {
            users: [],
            userCount: 0,
            state: 'idle'
        };
    };
    
    function joinRoom(room) {
        
        console.log("[" + self.iosocket.id + "] joined Room " + room);
        
        self.iosocket.join(room);
        rooms[room].users.push(self.iosocket);
        
        self.room = room;
    };
    
    function leaveRoom() {
        if( self.room === "" ) return;
        if( !rooms[self.room] ) return;
        
        var index = rooms[self.room].users.indexOf(self.iosocket);

        if( index == 0 ) {
            
            // Host has disconnected from Room
            // Delete Room
            console.log("Deleted Room " + self.room + " because room Host disconnected.");
            
            rooms[self.room].users.forEach(function(user) {
                if( user.id !== self.iosocket.id ) {
                    
                    // Let just others leave
                    // Self left already because of disconnect
                    user.leave(self.room);
                }
            });
            
            delete rooms[self.room];  
        } else if( index > -1 ) {
            
            // Remove Socket from room
            console.log("[" + self.iosocket.id + "] has been removed from Room " + self.room);
            rooms[self.room].users.splice(index, 1);
        } else {
            
            // @TODO handle not user in room
            console.log("User index in room is < -1.");
        }
    };
    
    function sendDisconnectSignal() {
        if( self.room === "" ) return;
        if( !rooms[self.room] ) return;
        
        if( self.mode === 'single' ) {
            
            // Emit Disconnect Signal to room host
            rooms[self.room].users[0].emit('signalling_message', {
                from: self.iosocket.id,
                type: 'peer_disconnect'
            });
        } else if( self.mode === 'multi' ) {
            
            // Emit Disconnect Signal to all
            rooms[self.room].users.forEach(function(user) {
                user.emit('signalling_message', {
                    from: self.iosocket.id,
                    type: 'host_disconnect'
                });
            });
        } else {
            // @TODO Handle unknwon Mode
        }
    }
}

Server.prototype.sendStatus = function(room) {
    // @TODO WIP ?
}


// Dirty Utilities
function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}

// http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
// user: broofa
function getUUID() {
    var id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
    
    return id;
}

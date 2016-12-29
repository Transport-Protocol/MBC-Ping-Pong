module.exports.Client = Client;
module.exports.Server = Server;
module.exports.ServerRooms = rooms;


var rtcconfig = {
	'iceServers': [{
		'url': 'stun:stun.l.google.com:19302'
	}]
};

var dataChannelOptions = {
	ordered: false,
	maxRetransmitTime: 1000
};

var conns;

function Client(iosocket, config, room, signallingCallback) {
    var self = this;
  
    self.iosocket = iosocket;

    self.id = self.iosocket.id;
    self.status = 'init';
    self.peers = {};
    self.connectioncount = 0;

    self.rtcPeerConnections = {};
    conns = self.rtcPeerConnections;

    self.messageCallback = null;

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

    console.log("I AM: " + self.iosocket.id);
  
  
    self.iosocket.on('signalling_message', function(data) {
        console.log("new signal");
        
        // Start Setting up connection after at least one other Peer 
        // is connected to the Server.
        // @IMPORTANT We receive only Signallin messages from OTHER Peers
        newConnection();
    
        if( data.type === 'hereandready' ) {
            
            // New User Connected to game <init>
            // @TODO handle multiple users in Multi mode
            console.log("New User connected.");
        } else {
            
            // Connection Controlling Signal
            var message = JSON.parse(data.message);
            
            if( message.sdp ) {
                
                // SDP
                gotSDP(message);
            } else if( message.candidate){
                
                // ICE CANDIDATE
                addCandidate(message);
            } else {
                
                // ERROR: Unknown Singal
                // @TODO handle Errors properly, use log?!
                console.log("Unknown Signal: " + JSON.stringify(message));
            }
        }
      });
    
    // Send initial Signal to Server
    self.iosocket.emit('signal', {"type":"hereandready", "mode":self.mode, "room":"testroom"});
  
    // @IMPORTANT @TODO refactor this. Chaotic Callback Hell...
    function gotSDP(message) {
        console.log("Got SDP Message.");
      
        if( self.mode === 'single' ) {
            
            // Only one Connection in Single Mode
            var connobj = self.rtcPeerConnections[0];
            
            // Set Remote Description
            connobj.connection.setRemoteDescription(
                // Add SDP information from Remote to init new SessionDescription
                new RTCSessionDescription(message.sdp), function() {
                    // Answer to any offer in this Session
                    if( connobj.connection.remoteDescription.type == 'offer' ) {
                        
                        // Create Answer to offer
                        connobj.connection.createAnswer(
                            function(desc) {
                                connobj.connection.setLocalDescription(desc, 
                                    function() {
                                        console.log("Sending local description");
                                        
                                        // Emit Answer
                                        self.iosocket.emit('signal', {
                                                               "type":"SDP", 
                                                               "message": JSON.stringify({
                                                                              'sdp': connobj.connection.localDescription 
                                                                          }), 
                                                               "room":"testroom"});
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
                }
            );
        }
    }
  
    function addCandidate(message) {
        console.log("Adding ICE-Candidate")
      
        if( self.mode === 'single' ) {
            
            // Only one Connection in Single Mode
            var connobj = self.rtcPeerConnections[0];
          
            // Add ICE Candidate from Signalling Message
            connobj.connection.addIceCandidate(new RTCIceCandidate(message.candidate));
        }
    }
  
    function newConnection() {
        if( self.mode === 'single' && self.connectioncount == 0) {
            
            // @TODO replace by better checks
            self.connectioncount++;
            
            // Mode is SINGLE
            console.log("Mode is single");

            // Create empty Object
            // @TODO replace by own connection Class
            self.rtcPeerConnections[0] = { "connection":null, "datachannel":null };
            var connobj = self.rtcPeerConnections[0];

            // Create new RTCPeerConnection und Datachannel
            connobj.connection = new webkitRTCPeerConnection(rtcconfig, null);
            connobj.datachannel = connobj.connection.createDataChannel('textMessages', dataChannelOptions);

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
                            self.messageCallback(message.data);
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
                        self.messageCallback(message.data);
                    }
                };
            };
            
            
      
      // Send ICE-Candidates to the Server
      connobj.connection.onicecandidate = function(data) {
        if( data.candidate ) {
          iosocket.emit('signal', {"type":"ice candidate", "message": JSON.stringify({'candidate': data.candidate}), "room":"testroom"});
          console.log("Candidate: " + data.candidate);
        }
      };
      
      // Negotiationneeded
      connobj.connection.onnegotiationneeded = function() {
          console.log("Negotiaton needed.");
          connobj.connection.createOffer(
            function(desc) {
                connobj.connection.setLocalDescription(desc, function() {
                    console.log("Sending local description");
                    self.iosocket.emit('signal', {"type":"SDP", "message": JSON.stringify({'sdp': connobj.connection.localDescription }), "room":"testroom"});
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
      // Mode is Multi
      var rtcPeerConn = { "connection":null, "datachannel":null };
      
      rtcPeerConn.connection = new webkitRTCPeerConnection(rtcconfig, null);
      rtcPeerConn.datachannel = rtcPeerConn.connection.createDataChannel('textMessages', dataChannelOptions);
    }
  }
}

Client.prototype.setMessageCallback = function(newCallback) {
    this.messageCallback = newCallback;
}

Client.prototype.sendMessage = function(msgType, data) {
    this.rtcPeerConnections[0].datachannel.send("PING");
}

Client.prototype.changeRoom = function(newroom) {
    // @TODO WIP
}

Client.prototype.setSignallingCallback = function(newCallback) {
    // @TODO WIP
}




var rooms = {
    'testroom': {
        users: [],
        userCount: 0,
        state: 'idle'
    }
};

function Server(iosocket, config) {
    var self = this;
  
    // Socket from Socket.io
    self.iosocket = iosocket;
    
    self.iosocket.on('disconnected', function(data) {
        console.log("Lost Connection to a Socket...");
        // @TODO handle disconnects
    });
  
    self.iosocket.on('signal', function(req) {
        console.log(self.iosocket.id + " => " + JSON.stringify(req));  
       
        if( req.type === "hereandready" ) {
            newPeer(req.room);
        }
    
        rooms[req.room].users.forEach(function(user) {
            // console.log("" + user.id + " : " + self.iosocket.id);
            if( user.id != self.iosocket.id ) {
                
                // Redirect Signal
                console.log("Send to: " + user.id);
                user.emit('signalling_message', {
                              type: req.type,
                              message: req.message
                          }
                );
            }
        });
    });
  
    function newPeer(room){
        
        // @TODO check for multiple same peers
        console.log("User joined room: " + room);
        
        self.iosocket.join(room);
        rooms[room].users.push(self.iosocket);
    };
}

Server.prototype.sendStatus = function(room) {
    // @TODO WIP ?
}

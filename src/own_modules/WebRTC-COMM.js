module.exports.Client = Client;
module.exports.Server = Server;
module.exports.ServerRooms = rooms;
module.exports.getID = getUUID;


var rtcconfig = {
	'iceServers': [
        //{ 'urls': 'stun:stun.l.google.com:19302' },
        //{ 'urls': 'stun:stun1.l.google.com:19305' },
        //{ 'urls': 'stun:stun2.l.google.com:19305' },
        //{ 'urls': 'stun:stun3.l.google.com:19305' },
        //{ 'urls': 'stun:stun4.l.google.com:19305' },
        { 'urls': 'stun:stun.schlung.de' }
    ]
};

var dataChannelOptions = {
    ordered: false,
	outOfOrderAllowed: true,
    maxRetransmitNum: 0
};

function Client(iosocket, config, room, signallingCallback) {

    // @TODO try reproduce socket.io timing problems by removing this.
    sleep(100);

    // Scope helper
    var self = this;

    self.iosocket = iosocket;

    self.room = room;

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

    self.dataChannel   = window.RTCDataChannel ||
                         window.DataChannel;



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
            console.log("New User connected.");

            var newUserID = data.from;

            newPeerToPeerConnection(newUserID);
        } else if( data.type === 'peer_disconnect' && self.mode === 'multi' ) {

            // A Peer has been disconnected
            var disconnectedPeerId = data.from;
            peerDisconnected(disconnectedPeerId);
        } else if( data.type === 'host_disconnect' && self.mode === 'single' ) {

            // Connection to host peer has been lost
            var disconnectedPeerId = data.from;
            hostDisconnected(disconnectedPeerId);
        } else if( data.type === 'candidate' ) {

            // Received a ICE Candidate
            var fromPeer = data.from;
            var message = JSON.parse(data.message);
            var connobj;

            if( self.mode === 'single' ) {

                if( !self.rtcPeerConnections[0] ) {
                    newPeerToPeerConnection(fromPeer);
                }

                connobj = self.rtcPeerConnections[0];
            } else if( self.mode === 'multi' ) {
                connobj = self.rtcPeerConnections[fromPeer];
            }

            handleIceCandidate(connobj, message);
        } else {

            // Connection Controlling Signal
            var message = JSON.parse(data.message);

            if( message.sdp ) {

                // SDP
                receivedSessionInfo(message, data.from);
            }  else {

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
    self.iosocket.emit('signal', {"type":"hereandready", "mode":self.mode, "room":room});

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

    function receivedSessionInfo(sessioninfo, peerid) {
        return new Promise(function(resolve, reject) {
            var connobj;

            if( self.mode === 'single' ) {

                // Mode is Single, we need to init a new Peer to Peer connection on our side
                // Then send our Session info back to the Host
                if( !self.rtcPeerConnections[0] ) {
                    newPeerToPeerConnection(peerid);
                }

                connobj = self.rtcPeerConnections[0];

                single_ICECandidatesReady(connobj, sessioninfo);
            } else if( self.mode === 'multi' ) {
                connobj = self.rtcPeerConnections[peerid];

                connobj.connection.setRemoteDescription(new self.sessionDesc(sessioninfo.sdp))
                .then(function() {
                    console.log("Setting Remote Description");
                })
                .catch(function(reason) {
                    console.log("ERROR: " + reason);
                });
            } else {
                reject(Error("Unknown Mode specified"));
            }
        });
    }

    function multi_initDataChannel(connobj) {
        connobj.datachannel = connobj.connection.createDataChannel("gameUpdates", dataChannelOptions);

        connobj.datachannel.onopen = function(eventdata) {
            console.log("Datachannel now open");
        };

        connobj.datachannel.onclose = function(eventdata) {
            console.log("Dartachannel now closed");
        };

        connobj.datachannel.onmessage = function(message) {
            console.log("Datachannel: " + message.data);
            var data = JSON.parse(message.data);
            if( self.messageCallback ) {
                self.messageCallback(data.type, data.from, data.message);
            }
        };
    }

    function single_initDataChannel(connobj) {
        console.log("Waiting for DataChannel");

        connobj.connection.ondatachannel = function(data) {
            console.log("Received DataChannel");

            connobj.datachannel = data.channel;

            connobj.datachannel.onopen = function(eventdata) {
                console.log("Datachannel now open");
            };

            connobj.datachannel.onclose = function(eventdata) {
                console.log("Dartachannel now closed");
            };

            connobj.datachannel.onmessage = function(message) {
                console.log("Datachannel: " + message.data);
                var data = JSON.parse(message.data);
                if( self.messageCallback ) {
                    self.messageCallback(data.type, data.from, data.message);
                }
            };
        };
    }

    function single_ICECandidatesReady(connobj, sessioninfo) {
        console.log("Setting Remote Description");
        connobj.connection.setRemoteDescription(new self.sessionDesc(sessioninfo.sdp))
        .then(function() {
            console.log("Creating Answer");
            return connobj.connection.createAnswer();
        })
        .then(function(answer) {
            console.log("Setting Local Description");
            return connobj.connection.setLocalDescription(answer);
        })
        .then(function() {
            gotAllICECandidates(connobj);
        })
        .catch(function(reason) {
            console.log("ERROR: " + reason);
        });
    }

    function multi_ICECandidatesReady(connobj) {
        console.log("Creating Offer");
        connobj.connection.createOffer()
        .then(function(offer) {
            console.log("Setting Local Description");
            return connobj.connection.setLocalDescription(offer);
        })
        .then(function() {
            gotAllICECandidates(connobj);
        })
        .catch(function(reason) {
            console.log("ERROR: " + reason);
        });
    }

    function gotAllICECandidates(connobj) {
        console.log("Sending Session Informations");
        sendSignal({
            type: "SDP",
            to: connobj.remotepeerid,
            message: JSON.stringify({
                sdp: connobj.connection.localDescription
            }),
            room: self.room
        });
    }

    function sendSignal(signalContent) {
        // Sending Signal to Signalling Server
        self.iosocket.emit("signal", signalContent);
    }

    function sendCandidate(connobj, candidate) {
        sendSignal({
            type: "candidate",
            to: connobj.remotepeerid,
            message: JSON.stringify(candidate),
            room: self.room
        });
    }

    function handleIceCandidate(connobj, candidate) {
        connobj.connection.addIceCandidate(new RTCIceCandidate(candidate));
    }

    function newPeerToPeerConnection(peerid) {
        if( self.mode === 'single' && self.connectioncount == 0 ) {

            // Mode is Single and no active Connections
            self.connectioncount++;

            console.log("Mode is Single");

            self.rtcPeerConnections[0] = {
                connection: null,
                datachannel: null,
                sdpdone: false,
                remotepeerid: peerid
            };

            var connobj = self.rtcPeerConnections[0];

            connobj.connection = new self.peerConnection(rtcconfig);

            single_initDataChannel(connobj);

            connobj.connection.onicecandidate = function(data) {
                if( data.candidate ) {
                    console.log("Got ICE Candidate: " + JSON.stringify(data.candidate));
                    sendCandidate(connobj, data.candidate);
                } else {
                    // single_ICECandidatesReady();
                    // gotAllICECandidates(connobj););
                }
            };
        } else if( self.mode === "multi" ) {

            console.log("Mode is Multi");

            self.connectioncount++;

            self.rtcPeerConnections[peerid] = {
                connection: null,
                datachannel: null,
                sdpdone: false,
                remotepeerid: peerid
            };

            var connobj = self.rtcPeerConnections[peerid];

            connobj.connection = new self.peerConnection(rtcconfig);

            multi_initDataChannel(connobj);

            connobj.connection.onicecandidate = function(data) {
                if( data.candidate ) {
                    console.log("Got ICE Candidate: " + JSON.stringify(data.candidate));
                    sendCandidate(connobj, data.candidate);
                } else {
                    // multi_ICECandidatesReady(connobj);
                    // gotAllICECandidates(connobj);

                }
            };
        }

        // Setup complete, EventListener are same for Single and Multi

        connobj.connection.onconnectionstatechange = function(data) {
            var state = connobj.connection.connectionState;

            console.log("Connectionstate changed <" + state + ">");

            connectionStateChange(connobj, state);
        };

        connobj.connection.oniceconnectionstatechange = function(data) {
            var state = connobj.connection.iceConnectionState;

            console.log("ICEConnectionstate changed <" + state + ">");

            connectionStateChange(connobj, state);
        };

        if( self.mode === 'multi' ) {
            multi_ICECandidatesReady(connobj);
            // gotAllICECandidates(connobj);
        } else {
            // single_ICECandidatesReady(connobj);
            // gotAllICECandidates(connobj);
        }

    }

    function connectionStateChange(connobj, state) {
        switch( state ) {
            case "connected":
                console.log("Successfully connected via WebRTC!");
                peerconnected(connobj.remotepeerid);
                break;

            case "disconnected":
                console.log("Disconnected from other Peer!");
                peerdisconnected(connobj.remotepeerid);
                break;

            case "failed":
                console.log("Could not establish a WebRTC connection!");
                break;
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

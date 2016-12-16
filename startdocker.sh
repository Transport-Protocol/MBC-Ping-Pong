#!/bin/bash

# cd /opt
#
# cd MBC-Ping-Pong

cd src

npm install
browserify public/js/DisplayPeerMain.js -o public/js/DisplayPeer_Bundle.js
browserify public/js/ControlPeerMain.js -o public/js/ControlPeer_Bundle.js
browserify public/js/testWebRTCClient_RAW.js -o public/js/testWebRTCClient_Bundle.js

exec nodejs server.js

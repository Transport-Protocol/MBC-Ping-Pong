#!/bin/bash



cd src

npm install
$APPDATA/npm/browserify.cmd public/js/DisplayPeerMain.js -o public/js/DisplayPeer_Bundle.js
$APPDATA/npm/browserify.cmd public/js/ControlPeerMain.js -o public/js/ControlPeer_Bundle.js
$APPDATA/npm/browserify.cmd public/js/testWebRTCClient_RAW.js -o public/js/testWebRTCClient_Bundle.js

exec node server.js

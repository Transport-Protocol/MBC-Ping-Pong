#!/bin/bash

browserify ./src/public/js/DisplayPeerMain.js -o src/public/js/DisplayPeer_Bundle.js
browserify ./src/public/js/ControlPeerMain.js -o src/public/js/ControlPeer_Bundle.js
browserify ./src/public/js/testWebRTCClient_RAW.js -o src/public/js/testWebRTCClient_Bundle.js
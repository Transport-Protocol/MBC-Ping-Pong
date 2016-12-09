#!/bin/bash

cd /opt

cd MBC-Ping-Pong

npm install
browserify public/js/testWebRTCClient_RAW.js -o public/js/testWebRTCClient_Bundle.js

exec nodejs server.js

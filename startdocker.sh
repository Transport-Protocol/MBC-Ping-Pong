#!/bin/bash

cd /opt

if [ ! -d MBC-Ping-Pong ]; then
	git clone https://github.com/Transport-Protocol/MBC-Ping-Pong
fi

cd MBC-Ping-Pong

npm install

nodejs server.js

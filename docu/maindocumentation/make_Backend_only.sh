#!/bin/sh

pdflatex -synctex=1 -interaction=nonstopmode "MBC-Ping-Pong_Backend_only".tex
state=$?
if [ ! $state = "0" ]; then
	echo "Failed to compile latex!" 1>&2
	exit $state
fi

pdflatex -synctex=1 -interaction=nonstopmode "MBC-Ping-Pong_Backend_only".tex
state=$?
if [ ! $state = "0" ]; then
	echo "Failed to compile latex!" 1>&2
	exit $state
fi

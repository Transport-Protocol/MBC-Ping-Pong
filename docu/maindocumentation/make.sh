#!/bin/sh

latex MBC-Ping-Pong
state=$?
if [ ! $state = "0" ]; then
	echo "Failed to compile latex!" 1>&2
	exit $state
fi


bibtex MBC-Ping-Pong
state=$?
if [ ! $state = "0" ]; then
	echo "Failed to compile bibtex!" 1>&2
	exit $state
fi

latex MBC-Ping-Pong
state=$?
if [ ! $state = "0" ]; then
	echo "Failed to compile latex!" 1>&2
	exit $state
fi

pdflatex MBC-Ping-Pong
state=$?
if [ ! $state = "0" ]; then
	echo "Failed to create pdf!" 1>&2
	exit $state
fi

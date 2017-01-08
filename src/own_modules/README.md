### Client ###  
Config:  
mode: <single | multi; default: single>  
maxpeers: <num; default: 1> num needs to be set when mode is multi  

A Peer in Single mode is connected a one other Peer. If there are multiple Peers in the room, the Single Peer will be connected to the first Multi Peer, or the first Single Peer.  
In this Project a Multi-Peer can be refered to a Display-Peer and a Single-Peer to a Control-Peer.
  
Status:  
init: initital state  
connecting: connection credentials are retrieved and distributed  
connected: successfull connected to a Peer  
disconnected: connection to all Peers lost  
var express = require('express')
,   app = express()
,   server = require('http').createServer(app)
,   config = require('./config.json');

server.listen(config.port);

//app.configure(function() {
    app.use('/' ,express.static('public/'));
    app.use('/node_modules', express.static('node_modules/'));
//});

app.get('/', function(req, res) {
    res.sendfile('public/index.html');
});

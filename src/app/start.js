var createServer = require('./server.js').createServer;
var config = process.argv[2];
var serverPort = process.argv[3];

var server = createServer(config);

server.on('listening', function() {
    console.log('Listening on', serverPort);
});

server.listen(serverPort, 'localhost');
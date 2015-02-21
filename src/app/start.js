var createServer = require('./server.js').createServer;
var config = process.argv[2];
var serverPort = process.argv[3];

console.log('Config file at', config)

var server = createServer({});

server.on('listening', function() {
    console.log('Listening on', serverPort);
});

server.listen(serverPort, 'localhost');
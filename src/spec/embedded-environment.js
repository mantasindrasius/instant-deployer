var createServer = require('../app/server.js').createServer;
var temp = require('temp').track();
var http = require('http');
var Promise = require('promise');
var enableDestroy = require('server-destroy');

var config = {
  port: 9920,
  fakeRepoPort: 9921
};

var readyEnvironment = {
    serverUrl: 'http://localhost:' + config.port + '/',
    fakeRepoUrl: 'http://localhost:' + config.fakeRepoPort + '/'
};

function startFakeRepo(port) {
    return http.createServer(function (req, res) {
        console.log('Fake repo', req.url);

        if (req.url === '/xyz/def/1.0/def-1.0.jar') {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end('<html><body>Up</body></html>');
        } else {
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.end('<html><body>Not found: ' + req.uri + '</body></html>');
        }
    }).listen(port);
}

function waitForServer(port) {
    return new Promise(function(fulfill, reject) {
        function retry(numTries) {
            function processError(err) {
                if (numTries <= 1)
                    reject(err);
                else
                    setTimeout(function() { retry(numTries - 1); }, 200);
            }

            http.get('http://localhost:' + port + '/', function (res) {
                console.log("Got response: " + res.statusCode);

                fulfill();
            }).on('error', function (e) {
                //cb();

                console.log("Retries left... " + numTries);

                processError(e);
            });
        }

        retry(40);
    });
}

function startEnvironment() {
    return new Promise(function(fulfill, reject) {
        temp.mkdir('deployer', function(err, dirPath) {
            var serverConfig = {
                deploymentRoot: dirPath
            };

            var server = createServer(serverConfig);
            var fakeRepoServer = startFakeRepo(config.fakeRepoPort);

            enableDestroy(server);
            enableDestroy(fakeRepoServer);

            server.on('close', function() {
                console.log('Server stopped');
            });

            server.listen(config.port, 'localhost');

            readyEnvironment.config = config;
            readyEnvironment.serverConfig = serverConfig;
            readyEnvironment.server = server;
            readyEnvironment.deploymentRoot = dirPath + '/';
            readyEnvironment.stop = function() {
                server.destroy();
                fakeRepoServer.destroy();
            };

            fulfill(readyEnvironment);

            waitForServer(config.port)
                .then(fulfill)
                .catch(reject);
        });
    })
}

module.exports = {
    readyEnvironment: readyEnvironment,
    environment: startEnvironment()
};
var createServer = require('../app/server.js').createServer;
var temp = require('temp').track();
var http = require('http');
var Promise = require('promise');
var enableDestroy = require('server-destroy');

var config = {
  port: 9920
};

var readyEnvironment = {
    serverUrl: 'http://localhost:' + config.port + '/'
};

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
            var conf = dirPath;
            var server = createServer(conf);

            enableDestroy(server);

            server.on('close', function() {
                console.log('Server stopped');
            });

            server.listen(config.port, 'localhost');

            readyEnvironment.config = config;
            readyEnvironment.confFile = conf;
            readyEnvironment.server = server;
            readyEnvironment.deploymentRoot = dirPath;

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
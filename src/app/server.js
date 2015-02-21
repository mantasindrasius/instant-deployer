var http = require('http');
var path = require('path');
var Promise = require('promise');
var fs = require('fs');
var fse = require('fs-extra');
var parseUrl = require('url').parse;

function downloadTo(url, downloadTo) {
    return new Promise(function(fulfill, reject) {
        http.get(url, function(resp) {
            var parsedUrl = parseUrl(url);
            var urlPath = parsedUrl.path;
            var name = path.basename(urlPath);
            var filename = downloadTo + '/' + name;

            fse.mkdirsSync(downloadTo);

            fs.open(filename, 'w', function(err, fd) {
                if (fd) {
                    resp.on('data', function (data) {
                        fs.writeSync(fd, data, 0, data.length);
                    }).on('end', function () {
                        console.log('Downloaded to', filename)
                        fs.close(fd, fulfill);
                    });
                } else {
                    console.log(err);

                    reject(err);
                }
            });
        }).on('error', reject)
    });
}

module.exports = {
    createServer: function(config) {
        return http.createServer(function (req, res) {
            if (req.url == '/publish') {
                var body = "";
                req.on('data', function (chunk) {
                    body += chunk;
                });
                req.on('end', function () {
                    var deploymentEvent = JSON.parse(body);
                    var dirName = deploymentEvent.groupId + '.' + deploymentEvent.artifactId;

                    var deployTo = path.join(config.deploymentRoot, dirName, deploymentEvent.version);
                    var downloadFrom = deploymentEvent.url;

                    downloadTo(downloadFrom, deployTo)
                        .then(function() {
                            res.writeHead(200, {'Content-Type': 'application/json'});
                            res.end('"OK"');
                        });
                });

            } else if (req.url == '/') {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end('<html><body>Up</body></html>');
            } else {
                res.writeHead(404, {'Content-Type': 'text/html'});
                res.end('<html><body>Not found: ' + req.uri + '</body></html>');
            }
        });
    }
};

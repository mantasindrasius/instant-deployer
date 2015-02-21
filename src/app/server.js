var http = require('http');
var fs = require('fs');
var index = fs.readFileSync('index.html');

module.exports = {
    createServer: function(conf) {
        console.log('Config at', conf);

        return http.createServer(function (req, res) {
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end(index);
        });
    }
};

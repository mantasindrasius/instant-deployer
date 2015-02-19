var http = require('http');
var fs = require('fs');
var index = fs.readFileSync('index.html');

module.exports = {
    server: http.createServer(function (req, res) {
        //for (i in req) console.log(i);

        console.log('REQUEST');

        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(index);
    })
};

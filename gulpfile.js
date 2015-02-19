var gulp = require('gulp');
var jasmine = require('gulp-jasmine');
var server = require('./src/app/server.js').server;
var http = require('http');
var client = require('./src/spec/req-counting-http-client.js').client;

require('server-destroy')(server);

var jasmineReporters = require('jasmine-reporters');
var jasmineOptions = {
    reporter: new jasmineReporters.TeamCityReporter()
};

var serverPort = 9921;

gulp.task('default', ['e2e']);

gulp.task('start-server', function () {
    server.on('close', function() {
        console.log('Server stopped');
    });

    server.listen(serverPort, 'localhost');
});

gulp.task('stop-server', function () {
    client.on('no-more-pending', function() {
        console.log('Server stopping');
        server.destroy();
    });
});

gulp.task('e2e', ['start-server', 'wait-for-server'], function () {
    return gulp.src('src/spec/e2e/**')
        .pipe(jasmine(jasmineOptions))
        .on('finish', function() {
            gulp.start('stop-server');
        });
});


gulp.task('wait-for-server', function(cb) {
    function retry(numTries) {
        function processError() {
            if (numTries <= 1)
                cb();
            else
                setTimeout(function() { retry(numTries - 1); }, 1000);
        }

        http.get('http://localhost:' + serverPort + '/', function (res) {
            console.log("Got response: " + res.statusCode);

            cb();
        }).on('error', function (e) {
            //cb();

            console.log("Retries left... " + numTries);

            processError();
        });
    }

    retry(40)
});

var gulp = require('gulp');
var jasmine = require('gulp-jasmine');
var environment = require('./src/spec/embedded-environment.js').environment;
var client = require('./src/spec/req-counting-http-client.js').client;

var jasmineReporters = require('jasmine-reporters');
var jasmineOptions = {
    reporter: new jasmineReporters.TeamCityReporter()
};

var env;

gulp.task('default', ['e2e']);

gulp.task('start-environment', function (cb) {
    environment.then(function(readyEnv) {
        env = readyEnv;

        cb();
    });
});

gulp.task('stop-environment', function () {
    client.on('no-more-pending', function() {
        env.stop();
    });
});

gulp.task('e2e', ['start-environment'], function () {
    return gulp.src('src/spec/e2e/**')
        .pipe(jasmine(jasmineOptions))
        .on('finish', function() {
            gulp.start('stop-environment');
        });
});

var gulp = require('gulp');
var jasmine = require('gulp-jasmine');

var jasmineReporters = require('jasmine-reporters');
var jasmineOptions = {
    reporter: new jasmineReporters.TeamCityReporter()
};

gulp.task('default', ['e2e']);

gulp.task('e2e', function () {
    return gulp.src('src/spec/e2e/**')
        .pipe(jasmine(jasmineOptions));
});

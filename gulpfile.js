var gulp = require('gulp');
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('build', function() {
  return gulp.src('./src/*')
    .pipe(babel({ modules: "umd" }))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('build-dev', function() {
  return gulp.src('./src/*')
    .pipe(sourcemaps.init())
    .pipe(babel({ modules: "umd" }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('default', ['build']);

gulp.task('watch', ['build-dev'], function() {
  gulp.watch('./src/*', ['build-dev']);
});


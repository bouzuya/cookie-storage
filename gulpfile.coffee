babel = require 'gulp-babel'
coffee = require 'gulp-coffee'
espower = require 'gulp-espower'
gulp = require 'gulp'
mocha = require 'gulp-mocha'
sourcemaps = require 'gulp-sourcemaps'

gulp.task 'build', ->
  gulp.src './src/*'
    .pipe babel modules: 'umd'
    .pipe gulp.dest './dist/'

gulp.task 'build-dev', ->
  gulp.src './src/*'
    .pipe sourcemaps.init()
    .pipe babel modules: 'umd'
    .pipe sourcemaps.write()
    .pipe gulp.dest './dist/'

gulp.task 'build-test', ->
  gulp.src './test/*'
    .pipe sourcemaps.init()
    .pipe coffee()
    .pipe espower()
    .pipe sourcemaps.write()
    .pipe gulp.dest './.tmp/'

gulp.task 'default', ['build']

gulp.task 'test', ['build-dev', 'build-test'], ->
  gulp.src './.tmp/*'
    .pipe mocha()

gulp.task 'watch', ['build-dev'], ->
  gulp.watch './src/*', ['build-dev']

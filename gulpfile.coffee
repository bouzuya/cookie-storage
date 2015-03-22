babel = require 'gulp-babel'
coffee = require 'gulp-coffee'
espower = require 'gulp-espower'
gulp = require 'gulp'
gutil = require 'gulp-util'
mocha = require 'gulp-mocha'
sourcemaps = require 'gulp-sourcemaps'

ignoreError = (stream) ->
  stream.on 'error', (e) ->
    gutil.log e
    @emit 'end'

gulp.task 'build', ->
  gulp.src './src/*'
    .pipe babel modules: 'umd'
    .pipe gulp.dest './dist/'

gulp.task 'build-dev', ->
  gulp.src './src/*'
    .pipe sourcemaps.init()
    .pipe ignoreError babel(modules: 'umd')
    .pipe sourcemaps.write()
    .pipe gulp.dest './dist/'

gulp.task 'build-test', ->
  gulp.src './test/*'
    .pipe sourcemaps.init()
    .pipe coffee()
    .pipe espower()
    .pipe sourcemaps.write()
    .pipe gulp.dest './.tmp/'

gulp.task 'build-test-dev', ->
  gulp.src './test/*'
    .pipe sourcemaps.init()
    .pipe ignoreError coffee()
    .pipe ignoreError espower()
    .pipe sourcemaps.write()
    .pipe gulp.dest './.tmp/'

gulp.task 'default', ['build']

gulp.task 'test', ['build', 'build-test'], ->
  gulp.src './.tmp/*'
    .pipe mocha()

gulp.task 'test-dev', ['build-dev', 'build-test-dev'], ->
  gulp.src './.tmp/*'
    .pipe ignoreError mocha()

gulp.task 'watch', ['build-dev'], ->
  gulp.watch ['./src/*', './test/*'], ['test-dev']

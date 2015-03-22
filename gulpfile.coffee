gulp = require 'gulp'
babel = require 'gulp-babel'
sourcemaps = require 'gulp-sourcemaps'

gulp.task 'build', ->
  gulp.src './src/*'
    .pipe babel modules: 'umd'
    .pipe gulp.dest './dist/'

gulp.task 'build-dev', ->
  gulp.src './src/*'
    .pipe sourcemaps.init()
    .pipe babel modules: 'umd'
    .pipe sourcemaps.write '.'
    .pipe gulp.dest './dist/'

gulp.task 'default', ['build']

gulp.task 'watch', ['build-dev'], ->
  gulp.watch './src/*', ['build-dev']

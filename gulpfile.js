var gulp = require('gulp');
var babel = require('gulp-babel');

gulp.task('build', function() {
  return gulp.src('./src/*')
    .pipe(babel({ modules: "umd" }))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('default', ['build']);


var templateCache = require('gulp-angular-templatecache');
var gulp = require("gulp");
gulp.task('default', function() {
  return gulp.src(['templates/**/*.html', 'templates/**/**/*.html', 'templates/**/**/**/*.html', 'templates/**/**/**/**/*.html'])
  .pipe(templateCache())
  .pipe(gulp.dest(""));
});

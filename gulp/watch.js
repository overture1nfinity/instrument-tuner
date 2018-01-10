'use strict';

var config = require('./config');

var browserSync = require('browser-sync');
var gulp = require('gulp');
var path = require('path');

gulp.task('watch', ['inject'], function() {
  gulp.watch([path.join(config.paths.src, '/*.html'), 'bower.json'],
      ['inject-reload']);

  gulp.watch([
    path.join(config.paths.src, '/**/*.css'),
    path.join(config.paths.src, '/**/*.scss'),
  ], function(event) {
    if (isOnlyChange(event)) {
      gulp.start('styles-reload');
    }
    else {
      gulp.start('inject-reload');
    }
  });

  gulp.watch(config.paths.scripts, function(event) {
    if (isOnlyChange(event)) {
      gulp.start('scripts-reload');
    }
    else {
      gulp.start('inject-reload');
    }
  });

  gulp.watch(path.join(config.paths.src, '/**/*.html'), function(event) {
    browserSync.reload(event.path);
  });
});

function isOnlyChange(event) {
  return event.type === 'changed';
}

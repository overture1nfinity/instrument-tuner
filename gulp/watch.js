'use strict';

var browserSync = require('browser-sync');
var gulp = require('gulp');
var path = require('path');

var config = require('./config');
var scripts = require('./scripts');
var styles = require('./styles');

/**
 * Build project and watch for all changes.
 * @gulptask watch
 */
gulp.task('watch', ['inject'], function() {
  // When any of root HTML files or `bower.json` updates, we want to launch
  // `inject` task, since it injects Bower dependencies.
  gulp.watch([path.join(config.paths.src, '*.html'), 'bower.json'],
    ['inject:reload']);

  scripts.watch(function() {
    gulp.start('inject:reload');
  });

  styles.watch(function() {
    gulp.start('inject:reload');
  });

  // Reload when any of app HTML files updates.
  gulp.watch(path.join(config.paths.src, '**/*.html'), function(event) {
    browserSync.reload(event.path);
  });
});

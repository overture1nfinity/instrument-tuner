'use strict';

var config = require('./config');

var $ = require('gulp-load-plugins')();
var _ = require('lodash');
var browserSync = require('browser-sync');
var gulp = require('gulp');
var gulpUtil = require('gulp-util');
var path = require('path');
var wiredep = require('wiredep').stream;

gulp.task('styles', function() {
  return buildStyles();
});

gulp.task('styles-reload', function() {
  return buildStyles().pipe(browserSync.stream({match: '**/*.css'}));
});

var buildStyles = function() {
  var injectFiles = gulp.src([
    path.join(config.paths.src, '/**/' + (config.sass.excludeUnderscored ? '[^_]' : '') + '*.scss'),
    path.join('!' + config.paths.src, '/index.scss'),
  ], {read: false});

  var injectOptions = {
    addRootSlash: false,
    transform: function(filePath) {
      filePath = filePath.replace(config.paths.src + '/', '');
      return '@import "' + filePath + '";';
    },
    starttag: '// injector',
    endtag: '// endinjector',
  };

  var res = null;
  try {
    res = gulp.src([
      path.join(config.paths.src, '/index.scss'),
    ]).
        pipe($.inject(injectFiles, injectOptions)).
        pipe(wiredep(_.extend({}, config.wiredep))).
        pipe($.sourcemaps.init()).
        pipe($.sass(config.sass.options)).
        on('error', config.errorHandler('Sass')).
        pipe($.autoprefixer()).
        on('error', config.errorHandler('Autoprefixer')).
        pipe($.sourcemaps.write('maps')).
        pipe(gulp.dest(path.join(config.paths.tmp, '/serve/app/')));
  }
  catch(e) { config.errorHandler('injection err')(e.toString()); }
  return res;
}

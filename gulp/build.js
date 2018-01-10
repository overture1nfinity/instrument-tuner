'use strict';

var config = require('./config');

var $ = require('gulp-load-plugins')();
var gulp = require('gulp');
var path = require('path');

gulp.task('build', ['html', 'other']);

gulp.task('html', ['inject', 'fonts', 'partials'], function() {
  var partialsInjectFile = gulp.src(
      path.join(config.paths.tmp, '/partials/templateCacheHtml.js'),
      {read: false});
  var partialsInjectOptions = {
    addRootSlash: false,
    ignorePath: path.join(config.paths.tmp, '/partials'),
    starttag: '<!-- inject:partials -->',
  };

  var cssFilter = $.filter('**/*.css', {restore: true});
  var jsFilter = $.filter(['!**/*.spec.js', '**/*.js'], {restore: true});
  var htmlFilter = $.filter('*.html', {restore: true});

  return gulp.src(path.join(config.paths.tmp, '/serve/*.html')).
      pipe($.inject(partialsInjectFile, partialsInjectOptions)).
      pipe($.useref()).
      pipe(jsFilter).
      pipe($.rev()).
      pipe($.sourcemaps.init()).
      pipe($.ngAnnotate()).
      pipe($.uglify({output: {comments: 'some'}})).
      on('error', config.errorHandler('Uglify')).
      pipe($.sourcemaps.write('maps')).
      pipe(jsFilter.restore).
      pipe(cssFilter).
      pipe($.rev()).
      pipe($.sourcemaps.init()).
      pipe($.cssnano({zindex: false})).
      pipe($.sourcemaps.write('maps')).
      pipe(cssFilter.restore).
      pipe($.revReplace()).
      pipe(htmlFilter).
      pipe($.htmlmin(config.htmlminOptions)).
      pipe(htmlFilter.restore).
      pipe(gulp.dest(path.join(config.paths.dist, '/'))).
      pipe($.size({title: path.join(config.paths.dist, '/'), showFiles: true}));
});

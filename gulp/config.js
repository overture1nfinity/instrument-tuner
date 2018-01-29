'use strict';

var gulp = require('gulp');
var gulpUtil = require('gulp-util');
var path = require('path');

exports.mainAngularModule = 'app';

exports.paths = {
  src: 'src',
  dist: 'dist',
  tmp: '.tmp',
  templates: 'gulp/templates',
};

exports.paths.scripts = [
  path.join(exports.paths.src, '/**/*.js'),
  path.join(exports.paths.src, '/**/*.*.js'),
  path.join('!' + exports.paths.src, '/**/*.spec.js'),
  path.join('!' + exports.paths.src, '/**/*.bku.js'),
];

exports.wiredep = {
  directory: 'bower_components',
};

exports.sass = {
  excludeUnderscored: false,
  options: {
    outputStyle: 'expanded',
    precision: 10,
  },
};

exports.htmlminOptions = {
  collapseBooleanAttributes: true,
  collapseWhitespace: true,
  removeAttributeQuotes: true,
  removeEmptyAttributes: true,
};

exports.errorHandler = function(title) {
  return function(err) {
    gulpUtil.log(gulpUtil.colors.red('[' + title + ']'), err.toString());
    //this.emit('end'); // gives error (this === undefined)
  };
};

exports.warningHandler = function(title) {
  return function(warning) {
    gulpUtil.log(gulpUtil.colors.yellow('[' + title + ']'), warning.toString());
  };
};

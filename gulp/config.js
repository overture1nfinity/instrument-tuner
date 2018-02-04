'use strict';

var gulpUtil = require('gulp-util');

exports.mainAngularModule = 'app';

exports.paths = {
  src: 'src',
  dist: 'dist',
  tmp: '.tmp',
  partials: '.tmp/partials',
  templates: 'gulp/templates',
  scripts: [
    'src/**/*.js',
    '!src/**/*.{spec.js,test.js,bku.js}',
  ]
};

exports.templatecache = {
  filename: 'templateCacheHtml.js',
  options: {
    module: 'app',
    root: '',
  },
};

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

exports.htmlmin = {
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

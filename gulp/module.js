'use strict';

var config = require('./config');
var lib = require('./lib');

var gulp = require('gulp');
var path = require('path');
var argv = require('yargs').argv;

/** copyTemplateAndInjectVars metadata */
var args = [
    {
        name: 'name',
        value: argv.name || null,
        required: true,
    },
];
var tags = {
    name: {
        name: '/*@name*/',
        value: null,
    },
};
var filePaths = [
    path.join(config.paths.templates, '/module/**.*'),
];

gulp.task('module', function() {
    return lib.copyTemplatesAndInjectVars(args, tags, filePaths, argv.name);
});

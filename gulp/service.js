'use strict';

var config = require('./config');
var lib = require('./lib');

var gulp = require('gulp');
var path = require('path');
var argv = require('yargs').argv;


/** copyTemplatesAndInjectVars metadata */
var args = [
    {
        name: 'name',
        value: argv.name || null,
        required: true,
    },
    {
        name: 'module',
        value: argv.module || null,
        required: true,
    },
    {
        name: 'fn',
        value: argv.fn || null,
        required: true,
    },
];
var tags = {
    name: {
        name: '/*@name*/',
        value: null,
    },
    module: {
        name: '/*@module*/',
        value: null,
    },
    fn: {
        name: '/*@fn*/',
        value: null,
        singleQuotes: false,
    },
};
var filePaths = [
    path.join(config.paths.templates, '/service/**.*'),
];


gulp.task('service', function() {
    if(!argv.module) {
        config.errorHandler('arg error')('--module not defined.');
        return null;
    }

    var destPath = path.join(argv.module, 'services');

    return lib.copyTemplatesAndInjectVars(args, tags, filePaths, destPath, function(tags) {
        // before inject
    });
});

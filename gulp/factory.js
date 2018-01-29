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
    name_nq: {
        name: '/*@name_nq*/',
        value: null,
        singleQuotes: false,
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
    path.join(config.paths.templates, '/factory/**.*'),
];


gulp.task('factory', function() {
    if(!argv.module) {
        config.errorHandler('arg error')('Arg --module is required.');
        return null;
    }

    var destPath = path.join(argv.module, 'services/factories');

    return lib.copyTemplatesAndInjectVars(args, tags, filePaths, destPath, function(tags) {
        // before inject
        var name = tags.name.value.replace(/'/g, '');
        tags.name_nq.value = name.replace('\'', '');
    });
});

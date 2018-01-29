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
        name: 'controller',
        value: argv.controller || null,
    },
    {
        name: 'controllerAs',
        value: argv.controllerAs || null,
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
    templateUrl: {
        name: '/*@templateUrl*/',
        value: null,
    },
    controller: {
        name: '/*@controller*/',
        value: 'ComponentController',
        singleQuotes: false, // no quotes
    },
    controller_wq: {
        name: '/*@controller_wq*/',
        value: 'ComponentController',
        singleQuotes: true,
    },
    controllerAs: {
        name: '/*@controllerAs*/',
        value: 'vm',
    },
};
var filePaths = [
    path.join(config.paths.templates, '/component/**.*'),
];


gulp.task('component', function() {
    var error = false;

    if(!argv.module) {
        config.errorHandler('arg error')('Arg --module is required.');
        error = true;
    }

    if(!argv.name) {
        config.errorHandler('arg error')('Arg --name is required.');
        error = true;
    }

    if(error) return null;

    var destPath = path.join(argv.module, 'components', argv.name);

    return lib.copyTemplatesAndInjectVars(args, tags, filePaths, destPath, function(tags) {
        // replace the single quotes automatically added to the tag based on the flag singleQuotes:boolean
        var moduleName = tags.module.value.replace(/'/g, '');
        var name = tags.name.value.replace(/'/g, '');

        tags.templateUrl.value = path.join(moduleName, 'components', name, name + '.template.html');
        // escape all backslashes since we're injecting this in to an escapable string
        tags.templateUrl.value = tags.templateUrl.value.replace(/\\/g, '\\\\');

        tags.name_nq.value = name.replace('\'', '');
    });
});

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
    {
        name: 'link',
        value: argv.link || null,
    },
    {
        name: 'restrict',
        value: argv.restrict || null,
    }
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
        value: 'DirectiveController',
        singleQuotes: false, // no quotes
    },
    controller_wq: {
        name: '/*@controller_wq*/',
        value: 'DirectiveController',
        singleQuotes: true,
    },
    controllerAs: {
        name: '/*@controllerAs*/',
        value: 'vm',
    },
    link: {
        name: '/*@link*/',
        value: 'DirectiveLink',
        singleQuotes: false,
    },
    restrict: {
        name: '/*@restrict*/',
        value: 'A',
    }
};
var filePaths = [
    path.join(config.paths.templates, '/directive/**.*'),
];


gulp.task('directive', function() {
    if(!argv.module) {
        config.errorHandler('arg error')('Arg --module is required.');
        return null;
    }

    var destPath = path.join(argv.module, 'directives', argv.name);

    return lib.copyTemplatesAndInjectVars(args, tags, filePaths, destPath, function(tags) {
        /*// replace the single quotes automatically added to the tag based on the flag singleQuotes:boolean
        var moduleName = tags.module.value.replace(/'/g, '');*/
        tags.name_nq.value = tags.name.value.replace(/'/g, '');
        tags.controller_wq.value = tags.controller.value;

        /*tags.templateUrl.value = path.join(moduleName, 'directives', name, name + '.template.html');
        tags.templateUrl.value = tags.templateUrl.value.replace(/\\/g, '//');*/
    });
});

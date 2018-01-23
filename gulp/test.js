var gulp = require('gulp');
var path = require('path');
var argv = require('yargs').argv;
var KarmaServer = require('karma').Server;

var pckgFiles = [
    { pattern: '../bower_components/angular/angular.js', watched: false },
    { pattern: '../node_modules/angular-mocks/angular-mocks.js', watched: false },
    { pattern: '../bower_components/angular-bootstrap/ui-bootstrap-tpls.js', watched: false },
    { pattern: '../bower_components/lodash/dist/lodash.min.js', watched: false },
];

var libFiles = [
    'lib/native/**/*.js',
    'lib/**/*.module.js',
    'lib/**/*.values.js',
    'lib/**/*.service.js',
    'lib/**/*.factory.js',
    'lib/**/*.js',
];

var commonFiles = [
    'common/**/*.module.js',
    'common/**/*.values.js',
    'common/**/*.service.js',
    'common/**/*.factory.js',
    'common/**/*.js',
];

var appFiles = [
    { pattern: '../bower_components/angular-ui-router/release/angular-ui-router.min.js', watched: false },
    'app/**/*.module.js',
    'app/**/*.values.js',
    'app/**/*.service.js',
    'app/**/*.factory.js',
    'app/**/*.js',
];


gulp.task('test-all', function(done) {
    var singleRun = argv.once || false;
    var files = pckgFiles.concat(libFiles, commonFiles, appFiles);

    return new KarmaServer({
        configFile: path.join(__dirname, '../karma.conf.js'),
        files: files,
        preprocessors: {
            '**/!(spec|test|bku)/!(*spec|*test|*bku).js': ['coverage'],
        },
        coverageReporter: {
            type: 'html',
            dir: '../reports/coverage/all/',
        },
        singleRun: singleRun,
        autoWatch: !singleRun,
    }, done).start();
});


gulp.task('test-app', function(done) {
    var singleRun = argv.once || false;
    var files = pckgFiles.concat(libFiles, commonFiles, appFiles);

    return new KarmaServer({
        configFile: path.join(__dirname, '../karma.conf.js'),
        files: files,
        preprocessors: {
            'app/**/!(spec|test|bku)/!(*spec|*test|*bku).js': ['coverage'],
        },
        coverageReporter: {
            type: 'html',
            dir: '../reports/coverage/app/',
        },
        singleRun: singleRun,
        autoWatch: !singleRun,
    }, done).start();
});


gulp.task('test-common', function(done) {
    var singleRun = argv.once || false;
    var files = pckgFiles.concat(libFiles, commonFiles);

    return new KarmaServer({
        configFile: path.join(__dirname, '../karma.conf.js'),
        files: files,
        preprocessors: {
            'common/**/!(spec|test|bku)/!(*spec|*test|*bku).js': ['coverage'],
        },
        coverageReporter: {
            type: 'html',
            dir: '../reports/coverage/common/',
        },
        singleRun: singleRun,
        autoWatch: !singleRun,
    }, done).start();
});


gulp.task('test-lib', function(done) {
    var singleRun = argv.once || false;
    var files = pckgFiles.concat(libFiles);

    return new KarmaServer({
        configFile: path.join(__dirname, '../karma.conf.js'),
        files: files,
        preprocessors: {
            'lib/**/!(spec|test|bku)/!(*spec|*test|*bku).js': ['coverage'],
        },
        coverageReporter: {
            type: 'html',
            dir: '../reports/coverage/lib/',
        },
        singleRun: singleRun,
        autoWatch: !singleRun,
    }, done).start();
});

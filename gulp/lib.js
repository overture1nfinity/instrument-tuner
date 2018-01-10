'use strict';

var config = require('./config');

var gulp = require('gulp');
var gulpUtil = require('gulp-util');
var _ = require('lodash');
var path = require('path');
var through = require('through2');

/**
 * @summary Copies template files and injects arguments in place of tags within the files.
 * @description
 * Special tag properties:
 *  required: boolean = false : make the arg required or not
 *  singleQuotes: boolean = true : wrap tag's value in single quotes
 *  doubleQuotes: boolean = false : wrap tag's value in double quotes
 * 
 * @param {array} args 
 * @param {object} tags 
 * @param {array} filePaths 
 * @param {string} destPath Assumed relative directory == src/
 * 
 * @callback beforeInjectCb Before injection / copying; after updating all tags' values with args' values.
 * @param {object} tags A reference to the tags object.
 * 
 * @callback afterInjectCb 
 */
exports.copyTemplatesAndInjectVars = function(
args, tags, filePaths, destPath, 
beforeInjectCb=function(a){}, 
afterInjectCb=function(){}) {

    if(
        args && args.length > 0 && 
        tags && 
        filePaths && filePaths.length > 0 && 
        destPath && destPath.length > 0
    ) {
        var _tags = Object.assign({}, tags);
        destPath = path.join('src', destPath);

        /** assign tag values from args */
        _.forEach(args, function(arg) {
            
            if(arg && arg.name) {
                if(arg.value !== null) {
                    var tag = _tags[arg.name];

                    if(tag) {
                        tag.value = arg.value.toString(); // set value to replace tag in template file
                    }
                    else {
                        config.warningHandler('tag warning')("Skipping arg '" + arg.name + "'... No tag metadata specified.");
                    }
                }

                else if(arg.required) {
                    config.errorHandler('arg error')("Arg '--" + arg.name + "' is required.");
                }
            }

            else {
                config.warningHandler('arg warning')('Skipping unknown arg... Invalid arg or null');
            }

        });

        beforeInjectCb(_tags);

        /** copy files */
        var srcResult = gulp.src(filePaths)
        .pipe(through.obj(function(file, enc, cb) {

            var fileName = file.relative;
            var fileNameSplit = fileName.split('.').slice(1); // the string before the first . of the filename is considered the "true" filename.
            var nameTag = _tags.name.value.replace(/'/g, '');
            var newFileName = nameTag + '.' + fileNameSplit[0] + '.' + fileNameSplit[1];

            _.forEach(_tags, function(tag) {
                if(tag.value) { // skip if the tag's value wasn't assigned in the args' forEach loop

                    if(tag.singleQuotes === undefined && !tag.doubleQuotes) tag.singleQuotes = true; // true by default

                    if(tag.singleQuotes) {
                        tag.value = "'" + tag.value + "'";
                        tag.singleQuotes = false;
                    }
                    else if(tag.doubleQuotes) {
                        tag.value = '"' + tag.value + '"';
                        tag.doubleQuotes = false;
                    }

                    // inject vars
                    var fileContents = file.contents.toString(); // file.contents is a nodejs Buffer object. toString() converts its binary data to a string
                    fileContents = fileContents.replace(new RegExp(escapeRegExp(tag.name), 'g'), tag.value);
                    file.contents = new Buffer(fileContents); // tried to use Buffer.prototype.fill and couldn't get it right.
                }

            });

            file.path = path.join(file.base, newFileName);
            gulpUtil.log(gulpUtil.colors.green(newFileName + ' injected successfully'));
            cb(null, file);

        }))
        .pipe(gulp.dest(destPath));

        afterInjectCb();
    }
    else {
        config.errorHandler('misuse error')('Required params missing.');
    }
}

// from MDN
function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

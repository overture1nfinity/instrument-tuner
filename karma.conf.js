module.exports = function(config) {
    config.set({
        basePath: './src',
        browsers: ['Chrome'],
        frameworks: ['jasmine'],
        reporters: ['progress', 'coverage'],
    });
}

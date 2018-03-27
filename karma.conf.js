
module.exports = (config) => {
  config.set({
    files: [
      { pattern: 'test.js', watched: false },
      { pattern: 'tests/*.html', watched: false }
    ],
    html2JsPreprocessor: {
      // strip this from the file path
      stripPrefix: 'public/',

      // prepend this to the file path
      prependPrefix: 'served/',

      // or define a custom transform function
      processPath: function (filePath) {
        // Drop the file extension
        return filePath.replace(/\.html$/, '');
      }
    },
    preprocessors: {
      'tests/*.html': ['html2js'],
      'test.js': ['webpack']
    },
    webpack: {
      mode: 'development',
      module: {
        rules: [
          {
            test: /\.js$/, 
            exclude: /node_modules/, 
            loader: 'babel-loader', 
            options: {
              babelrc: true
            } }
        ]
      },
      watch: true
    },
    webpackServer: {
      noInfo: true
    },
    plugins: [
      'karma-chrome-launcher',
      'karma-webpack',
      'karma-html2js-preprocessor',
      'karma-jasmine',
      'karma-jasmine-jquery'
    ],
    frameworks: ['jasmine-jquery', 'jasmine'],
    browsers: ['Chrome']
  })
}
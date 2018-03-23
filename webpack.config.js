const path = require('path');

module.exports = {
  mode: "development",
  entry: './src/index.coffee',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    port: 3000,
    contentBase: "./dist",
    historyApiFallback: {
      index: 'index.html'
    }
  },
  module: {
    rules: [
      {
        test: /\.coffee$/,
        loader: "coffee-loader"
      }
    ]
  },
  resolve: {
    extensions: [".web.coffee", ".web.js", ".coffee", ".js"]
  }
};
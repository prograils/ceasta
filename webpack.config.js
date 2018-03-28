const path = require('path');
const webpack = require('webpack');
module.exports = {
  mode: "development",
  entry: './src/init.js',
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
        test: /(\.js)$/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: true
          }
        },
        include: [
          path.join(__dirname, 'src'),
          path.join(__dirname, 'tests')
        ],
        exclude: /(node_modules|bower_components)/
      }
    ]
  }
};
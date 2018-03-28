const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
module.exports = {
  mode: "development",
  entry: {
    "bundle.min": './src/ceasta.js'
  },
  devtool: "source-map",
  output: {
    filename: 'bundle.min.js',
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
  },
  plugins: [
    new UglifyJsPlugin({
      include: /\.min\.js$/,
      sourceMap: true
    })
  ]
};
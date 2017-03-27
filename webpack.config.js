/* global __dirname, require, module */

require('webpack');
const path = require('path');

const config = {
  entry: [
    path.resolve(__dirname, './src/index.js'),
  ],
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'hodc-typeahead.js',
    library: 'hodc-typeahead',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    modules: [path.resolve(__dirname, './src'), 'node_modules'],
    extensions: ['.json', '.js', '.jsx'],
  },
};

module.exports = config;

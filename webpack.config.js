const path = require('path');
const webpack = require('webpack');
module.exports = {
  context: path.resolve(__dirname, './src'),
  entry: {
    app: './app.js',
  },
  rules: [
    {
      test: /(\.jsx|\.js)$/,
      exclude: [/node_modules/],
      use: [{
        loader: 'babel-loader',
        options: {
          presets: ['es2015', 'react'],
        }
      }],
    },

    // Loaders for other file types can go here
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, './dist/assets'),
    publicPath: '/assets',                          // New
  },
  resolve: {
    modules: [path.resolve('./src')],
    extensions: ['.js']
  },
  devServer: {
    contentBase: path.resolve(__dirname, './src'),  // New
  },
};
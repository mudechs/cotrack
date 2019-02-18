const ExtractTextPlugin = require('extract-text-webpack-plugin');
// const webpack = require('webpack')
const path = require('path');

const extractSass = new ExtractTextPlugin({
  filename: 'public/app.css'
});

function sassRules() {
  return [{
    test: /\.(sass|scss)$/,
    use: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: ['css-loader', 'sass-loader']
    })
  }];
}

function cssRules() {
  return [{
    test: /\.css$/,
    use: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: 'css-loader'
    })
  }];
}

function scriptRules() {
  return [{
    test: /\.js$/,
    exclude: [/node_modules/],
    loader: 'babel-loader',
    options: {
      presets: ['env']
    }
  }];
}

module.exports = {
  entry: [
    './resources/assets/sass/app.scss',
    './resources/assets/scripts/app.js'
  ],
  output: {
    path: path.resolve(__dirname, './'),
    filename: 'public/app.js'
  },
  module: {
    rules: sassRules().concat(scriptRules().concat(cssRules()))
  },
  plugins: [
    extractSass,
    new ExtractTextPlugin('[name].css')
  ]
};

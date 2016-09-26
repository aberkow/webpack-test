const path = require('path');
//const package = require('./package.json');
//takes require from './js/fromStylesheet.js' sends it through webpack loaders and outputs a native css file...
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// separate a monolithic stylesheets into different stylesheets...
const ExtractCssBlockPlugin = require('extract-css-block-webpack-plugin');

//includePaths is an array
const bourbon = require('node-bourbon').includePaths;
//here we need the second index in the array because the first index is actually the same as bourbon's...
const neat = require('node-neat').includePaths[1];

//just to prove what's going on with the arrays...
const neatFullPaths = require('node-neat').includePaths;

console.log(bourbon, neatFullPaths, 'from webpack');

const webpack = require('webpack');

 const config = {
  //test multiple entry points
  entry: {
    index: path.resolve(__dirname, './js/index.js'),
    chunkTest: path.resolve(__dirname, './js/chunkTest.js'),
    stylesheet: path.resolve(__dirname, './js/fromStylesheet.js')
  },
  //[name].js sets the filename to match the name of the entry files...
  //even though there can be only one output (not an object like 'entry') the code can still be split.
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js'
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: 'babel',
        query: {
          presets: ['es2015']
        }
      },
      //loader name convention short names = name-loader
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style?sourceMap', 'css?sourceMap!sass?includePaths[]=' + bourbon + '&includePaths[]=' + neat)
      },
      {
        test: "critical.css",
        loader: "style!css"
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('[name].css'),
    //the ExtractCssBlockPlugin must come after the ExtractTextPlugin to work correctly.
    new ExtractCssBlockPlugin()
  ],
  resolve: {
    moduleDirectories: ['node_modules'],
    extensions: ['', '.json', '.js', '.jsx']
  }
};

console.log(config.resolve, 'from resolve');

//console.log(config.module.loaders[1].loader, 'from config devtool');

module.exports = config;

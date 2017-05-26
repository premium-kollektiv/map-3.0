var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');

var globalplugins = {
    $: "jquery",
    jQuery: "jquery",
    L: "leaflet",
    config:"./config.js",
    loader:"./loader.js",
    xhr:"./xhr.js",
    popup:"./popup.js",
    search:"./search.js",
    session:"./session.js",
    //Bloodhound: 'bloodhound-js',
    //AddressPicker : './google-addresspicker.js'
};

module.exports = {
  context: __dirname,
  devtool: debug ? "inline-sourcemap" : null,
  entry: "./js/app.js",
  output: {
    path: __dirname + "/public/js",
    filename: "build.js"
  },
  plugins: debug ? [
      new webpack.ProvidePlugin(globalplugins)
    
  ] : [
    new webpack.ProvidePlugin(globalplugins),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ comments: false, mangle: true, sourcemap: false }),
  ],
};
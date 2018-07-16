"use strict";

const webpack = require("webpack");
const path = require("path");
var BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

module.exports = {
  entry: "./src/index.js",

  output: {
    path: path.resolve(__dirname, "build"),
    publicPath: "/build/",
    filename: "project.bundle.js"
  },

  module: {
    // loaders: [
    //     {
    //         test: /\.js$/,
    //         include: /src/,
    //         loader: 'babel',
    //         query: {
    //             presets: ['es2015']
    //         }
    //     }
    // ],
    rules: [
      {
        test: /\.js$/,
        include: /src/,
        use: ["babel-loader"]
      },
      {
        test: [/\.vert$/, /\.frag$/],
        use: "raw-loader"
      }
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      CANVAS_RENDERER: JSON.stringify(true),
      WEBGL_RENDERER: JSON.stringify(true)
    }),
    new BundleAnalyzerPlugin()
  ],

  devtool: "eval-source-map"
};

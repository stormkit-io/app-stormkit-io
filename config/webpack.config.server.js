const webpack = require("webpack");
const path = require("path");
const root = path.resolve(__dirname, "..");
const webpackConfig = require("./webpack.config");

module.exports = {
  mode: "production",

  target: "node",

  node: {
    __dirname: false,
  },

  entry: {
    server: [path.join(root, "src/server.tsx")],
  },

  output: {
    filename: "server.js",
    path: path.resolve(root, "dist"),
    libraryTarget: "commonjs",
  },

  resolve: webpackConfig.resolve,
  module: webpackConfig.module,
  plugins: [
    webpackConfig.plugins[0],
    webpackConfig.plugins[2],

    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
  ],
};

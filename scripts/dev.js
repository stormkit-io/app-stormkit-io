process.env.NODE_ENV = "development";
process.env.BABEL_ENV = "development";
process.env.PORT = process.env.PORT || 3000;
process.env.IP = process.env.IP || "localhost";

const webpack = require("webpack");
const devServer = require("webpack-dev-server");
const config = require("../webpack.config");
const devConfig = require("../webpack.dev-server");

const host = process.env.LISTEN;
const port = process.env.PORT;

const server = new devServer(devConfig, webpack(config));

server.start().then(() => {
  ["SIGINT", "SIGTERM"].forEach(function (sig) {
    process.on(sig, function () {
      server.close();
      process.exit();
    });
  });
});

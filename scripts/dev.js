process.env.NODE_ENV = "development";
process.env.BABEL_ENV = "development";
process.env.PORT = process.env.PORT || 3000;
process.env.IP = process.env.IP || "localhost";

const webpack = require("webpack");
const devServer = require("webpack-dev-server");
const config = require("../config/webpack.config");
const devConfig = require("../config/webpack.dev-server");

const host = process.env.LISTEN;
const port = process.env.PORT;

const server = new devServer(webpack(config), devConfig);

server.listen(port, host, () => {
  ["SIGINT", "SIGTERM"].forEach(function(sig) {
    process.on(sig, function() {
      server.close();
      process.exit();
    });
  });
});

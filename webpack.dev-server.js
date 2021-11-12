const fs = require("fs");
const path = require("path");

const config = {
  compress: true,

  historyApiFallback: true,

  hot: true,

  port: process.env.PORT || 3000,
  host: process.env.IP || "localhost",

  // Enable https with a self-signed certificate.
  https: {
    key: fs.readFileSync(path.resolve(__dirname, "./certs/localhost.key")),
    cert: fs.readFileSync(path.resolve(__dirname, "./certs/localhost.cert")),
  },

  proxy: {},
};

config.proxy[process.env.API_DOMAIN] = {
  target: process.env.API_PROXY_DOMAIN,
  changeOrigin: true,
  xfwd: true,
  cookieDomainRewrite: config.host,
  pathRewrite: {
    "^/api": "/",
  },
};

module.exports = config;

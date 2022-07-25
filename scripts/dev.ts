import fs from "fs";
import cp from "child_process";
import path from "path";
import webpack from "webpack";
import devServer from "webpack-dev-server";
import config from "../webpack.config";
import devConfig from "../webpack.dev-server";

// Create .env file if it does not exist
const envFile = path.join(__dirname, "../.env");
const envFileTemplate = path.join(__dirname, "../.env.example");

if (!fs.existsSync(envFile)) {
  console.info(".env file is not found: creating it from template.");
  cp.execSync(`cp ${envFileTemplate} ${envFile}`);
}

process.env.NODE_ENV = "development";
process.env.BABEL_ENV = "development";
process.env.PORT = process.env.PORT || "3000";
process.env.IP = process.env.IP || "localhost";

const server = new devServer(devConfig, webpack(config));

server.start().then(() => {
  ["SIGINT", "SIGTERM"].forEach(function (sig) {
    process.on(sig, function () {
      server.close();
      process.exit();
    });
  });
});

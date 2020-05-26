//
// Setup environment variables
//

process.env.NODE_ENV = "production";
process.env.BABEL_ENV = "production";
process.env.PORT = process.env.PORT || 3000;

const chalk = require("chalk");
const webpack = require("webpack");
const config = require("../config/webpack.client");
const compiler = webpack(config);

compiler.run((err, stats) => {
  if (err) {
    console.log(chalk.red(`Failed to compile: ${err.message || err} \n`));
    process.exit(1);
  }

  const info = stats.toJson();

  if (stats.hasErrors()) {
    console.log(info.errors.join("\n"));
    process.exit(1);
  }

  if (stats.hasWarnings()) {
    console.warn(info.warnings);
  }

  console.log(chalk.green("Compiled successfully.\n"));
  console.log(stats.toString());
});

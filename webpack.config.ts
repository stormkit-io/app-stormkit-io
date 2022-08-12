import path from "path";
import webpack, { Configuration } from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CleanWebpackPlugin from "clean-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { ESBuildMinifyPlugin } from "esbuild-loader";
import dotenv from "dotenv";
const config = dotenv.config();

// Helper variables
type envs = "development" | "production";
const env = (process.env.NODE_ENV as envs) || "production";
const isDev = env === "development";
const parsed = (config && config.parsed) || {};
const root = __dirname;

const webpackConfig: Configuration = {
  // Providing the mode configuration option tells webpack to use its built-in optimizations accordingly.
  // @see https://webpack.js.org/concepts/mode/
  mode: env,

  // Entry files
  // @see https://webpack.js.org/concepts/entry-points/
  entry: {
    main: [path.join(root, "src/index.tsx")],
  },

  output: {
    filename: isDev ? undefined : "client.[fullhash].js",
    chunkFilename: "[name].[chunkhash].js",
    path: path.join(root, "dist"), // The path to the bundle directory
    publicPath: process.env.PUBLIC_URL || "/", // Tell webpack to server always from the root
  },

  // @see https://webpack.js.org/configuration/resolve/
  resolve: {
    alias: {
      "~": path.join(root, "src"),
    },
    extensions: [".tsx", ".ts", ".js"],
  },

  // @see https://webpack.js.org/configuration/module/
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: "esbuild-loader",
            options: {
              loader: "jsx",
              target: "es2015",
            },
          },
          { loader: "source-map-loader" },
        ],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ["file-loader"],
      },
      {
        test: /\.css$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: "css-loader" },
          { loader: "postcss-loader" },
        ],
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "esbuild-loader",
            options: {
              loader: "tsx",
              target: "es2015",
            },
          },
          { loader: "source-map-loader" },
        ],
      },
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({
      ignoreOrder: false,
    }),

    new CleanWebpackPlugin({
      dry: false,
      cleanOnceBeforeBuildPatterns: [path.join(root, "dist")],
    }),

    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(
        process.env.NODE_ENV || "production"
      ),
      "process.env.SENTRY": JSON.stringify(process.env.SENTRY),

      // Merge dotenv config
      ...Object.keys(parsed).reduce((obj: Record<string, string>, key) => {
        obj[`process.env.${key}`] = JSON.stringify(parsed[key]);
        return obj;
      }, {}),
    }),

    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(root, "src/public/*"),
          globOptions: {
            ignore: ["**/index.html"],
          },
          to: "[name][ext]",
        },
      ],
    }),

    // The server will handle injecting files by itself.
    new HtmlWebpackPlugin({
      inject: true,
      template: path.join(root, "src/public/index.html"),
      publicFolder: process.env.PUBLIC_URL || "/",
      minify: !isDev,
    }),
  ],

  optimization: {
    minimizer: !isDev
      ? [new ESBuildMinifyPlugin({ target: "es2015", css: true })]
      : undefined,
  },

  performance: {
    hints: false,
  },
};

export default webpackConfig;

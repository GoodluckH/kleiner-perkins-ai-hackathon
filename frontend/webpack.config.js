var path = require("path");
var pathToPhaser = path.join(__dirname, "/node_modules/phaser/");
var phaser = path.join(pathToPhaser, "dist/phaser.js");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/game.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  //   devServer: {
  //     contentBase: path.resolve(__dirname, "./"),
  //     publicPath: "/dist/",
  //     compress: true,
  //     host: "127.0.0.1",
  //     port: 8080,
  //     open: true,
  //   },
  resolve: {
    extensions: [".ts", ".js"],
    alias: {
      phaser: phaser,
    },
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  devServer: {
    static: path.join(__dirname, "dist"),
    compress: true,
    port: 8080,
    open: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "BigDict",
    }),
  ],
};

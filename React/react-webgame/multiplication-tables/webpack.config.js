const webpack = require("webpack");
const path = require("path");

module.exports = {
  mode: "development",
  devtool: "eval", // production: hidden-source-map
  resolve: {
    extensions: [".jsx", ".js"],
  },

  entry: {
    app: "./client",
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env", "@babel/preset-react"],
          plugins: ["@babel/plugin-proposal-class-properties"],
        },
      },
    ],
  },
  output: {
    path: path.join(__dirname, "dist"), // C:\users\vicky\TIL\.. 이런거 안적어도 된다.
    filename: "app.js",
  },
};

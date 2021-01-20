const webpack = require("webpack");
const path = require("path"); // node에서 경로 조작하는 기능

module.exports = {
  name: "wordrelay-setting", // webpack 설정 이름
  mode: "development", // 실서비스 production
  devtool: "eval", // 빠르게 하겠다.
  resolve: {
    extensions: [".js", ".jsx"],
  },

  // 입력
  entry: {
    app: ["./client"],
  },

  module: {
    // 여러 규칙을 정할 수 있으므로 배열이다
    rules: [
      {
        test: /\.jsx?/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env", "@babel/preset-react"],
          plugins: ["@babel/plugin-proposal-class-properties"],
        },
      },
    ],
  },

  //출력
  output: {
    path: path.join(__dirname, "dist"), // C:\users\vicky\TIL\.. 이런거 안적어도 된다.
    filename: "app.js",
  },
};

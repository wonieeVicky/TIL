const path = require("path"); // node에서 경로 조작하는 기능
const RefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

module.exports = {
  name: "lecture-setting", // webpack 설정 이름
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
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        options: {
          presets: [
            [
              "@babel/preset-env",
              {
                targets: {
                  browsers: ["> 5% in KR"], // 브라우저별 설정이 가능하다. (참조 //github.com/browserslist/browserslist)
                },
                debug: true,
              },
            ],
            "@babel/preset-react",
          ],
          plugins: ["@babel/plugin-proposal-class-properties", "react-refresh/babel"],
        },
      },
    ],
  },

  plugins: [new RefreshWebpackPlugin()],

  //출력
  output: {
    path: path.join(__dirname, "dist"), // 실제 경로
    publicPath: "/dist/", // 가상 경로 app.use("/dist", express.static)
    filename: "app.js",
  },

  devServer: {
    historyApiFallback: true, // GET 등의 오류 방어 설정
    publicPath: "/dist/",
    hot: true,
  },
};

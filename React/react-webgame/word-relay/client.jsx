// 설치할 패키지 import
const React = require("react");
const ReactDOM = require("react-dom");

const WordRelay = require("./WordRelay"); // 필요한 것만 호출할 수 있는 모듈 구조

ReactDOM.render(<WordRelay />, document.querySelector("#root"));

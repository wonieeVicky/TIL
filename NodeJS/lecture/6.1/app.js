const express = require("express");

// 전역변수 느낌적인 느낌
const app = express();
app.set("port", process.env.PORT || 3000);

// app에 메서드를 구현하는 방식으로 코드를 작성할 수 있다.
app.get("/", (req, res) => {
  res.send("Hello Express!");
});
app.get("/about", (req, res) => {
  res.send("about Express!");
});

// 별도 포트를 지정하지 않고, app의 포트번호를 가져온다.
app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기 중");
});

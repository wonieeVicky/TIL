const express = require("express");
const path = require("path");
const app = express();

app.set("port", process.env.PORT || 3000);

// 1. app.use를 통한 전 라우터 코드 실행 처리
app.use((req, res, next) => {
  console.log("모든 요청에 실행하고 싶다!");
  next(); // 반드시 next를 넣어준다.
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// 2. 라우터 매개변수를 이용한 라우터
app.get("/category/:name", (req, res) => {
  res.send(`hello ${req.params.name}`);
});

// 3. 정적 라우트 코드가 아래에 있으면 안된다.
app.get("/category/javascript", (req, res) => {
  res.send(`hello Test!`);
});

app.get("/", (req, res) => {
  res.send("hello express!");
});

app.get("/about", (req, res) => {
  res.send("about Express!");
});

// 4. 특히 모든 요청에 처리해야하는 라우터(*)의 경우 최하단에 위치시켜줘야한다.
app.get("*", (req, res) => {
  res.send("about global!");
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기 중");
});

const express = require("express");
const { get } = require("http");
const path = require("path");
const app = express();

app.set("port", process.env.PORT || 3000);

app.use((req, res, next) => {
  console.log("언제나 실행하는 코드");
  next();
});

app.get(
  "/",
  (req, res, next) => {
    res.sendFile(path.join(__dirname, "index.html"));
    next("route");
  },
  (req, res) => {
    console.log("??");
  }
);

app.get("/", (req, res, next) => {
  console.log("!");
});

app.get("/about", (req, res) => {
  res.send("about Express!");
});

// 2. 404 middleware
app.use((req, res, next) => {
  res.status(404).send("404지롱");
});

// 3. Error middleware (에러는 인자 4개를 반드시 다 적어야한다.)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("에러났어요 근데 안알려줄거임");
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기 중");
});

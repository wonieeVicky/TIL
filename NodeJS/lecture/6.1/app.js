const express = require("express");
const path = require("path");
const app = express();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const multer = require("multer");

app.set("port", process.env.PORT || 3000);

app.use(morgan("dev"));
// static은 순서가 중요하다. 왜냐하면 해당 파일을 찾으면 Next를 호출하지 않기 때문,
// cookieParser, json(), urlencoded() 상단에 위치하면 실행이 안되므로 리소스 누수가 방지할 수 있다.
app.use("/", express.static(path.join(__dirname, "public")));
app.use(cookieParser("vickyPassword"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session());
app.use(multer().array());

app.get("/", (req, res, next) => {
  req.body.name;
  req.cookies; // { mycookie: 'vicky'}
  req.signedCookies; // 쿠키를 암호화할 수 있다.
  // Set cookie
  res.cookie("name", encodeURIComponent(name), {
    expires: new Date(),
    httpOnly: true,
    path: "/",
  });
  // Delete cookie
  res.clearCookie("name", encodeURIComponent(name), {
    httpOnly: true,
    path: "/",
  });
  res.sendFile(path.join(__dirname, "index.html"));
});

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

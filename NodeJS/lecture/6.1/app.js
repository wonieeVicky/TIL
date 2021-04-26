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
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: "vickyPassword",
    cookie: {
      httpOnly: true,
    },
    name: "connect.sid", // default value
  })
); // 이걸 넣으면 req.session 사용 가능
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(multer().array());

app.get("/", (req, res, next) => {
  req.session.id = "hello"; // req.session으로 개인의 사용자에 대한 고유한 세션이 된다.
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

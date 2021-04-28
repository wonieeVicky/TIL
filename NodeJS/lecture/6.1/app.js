const dotenv = require("dotenv");
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const path = require("path");

dotenv.config(); // 최대한 위에서 dotenv에 대한 값을 가져오는 것이 좋다.
const app = express();
app.set("port", process.env.PORT || 3000);

app.use(morgan("dev"));
app.use("/", express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
    name: "session-cookie",
  })
);

// multer 호출
const multer = require("multer");
const fs = require("fs");

// multer 시 uploads 폴더 생성
try {
  fs.readdirSync("uploads");
} catch (error) {
  console.error("uploads 폴더가 없어 uploads 폴더를 생성합니다.");
  fs.mkdirSync("uploads");
}

// multer 설정 - diskStorage에 저장
// 어디에 어떻게 어떤 이름으로 저장할 것인지에 대한 설정을 upload객체를 생성 해준다.
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, "uploads/");
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname); // 확장자 추출
      done(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});
app.get("/upload", (req, res) => {
  res.sendFile(path.join(__dirname, "multipart.html"));
});
// upload 객체 장착 - 주로 특정 라우터에 지정하는 방식으로 사용한다.
// upload.single() : 한 개의 파일만 업로드 할 때 사용한다.
app.post("/upload", upload.single("image"), (req, res) => {
  console.log(req.file);
  res.send("ok");
});
app.post("/upload", upload.none(), (req, res) => {
  console.log(req.body);
  res.send("ok");
});

app.post("/upload", upload.array("many"), (req, res) => {
  console.log(req.files, req.body);
  res.send("ok");
});
app.post("/upload", upload.fields([{ name: "image1" }, { name: "image2" }]), (req, res) => {
  console.log(req.files, req.body);
  res.send("ok");
});

app.get(
  "/",
  (req, res, next) => {
    console.log("GET / 요청에서만 실행됩니다.");
    next();
  },
  (req, res) => {
    throw new Error("에러는 에러 처리 미들웨어로 갑니다.");
  }
);
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err.message);
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기 중");
});

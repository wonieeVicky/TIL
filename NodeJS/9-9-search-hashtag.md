# 해시태그 검색

### 해시태그 검색 기능 추가

- GET /hashtag 라우터 추가
  - 해시태그를 먼저 찾고(hashtag)
  - `hashtag.getPosts`로 해시태그와 관련된 게시글을 모두 찾음
  - 찾으면서 `include`로 게시글 작성자 모델도 같이 가져옴
- `routes/page.js`

  ```jsx
  // ..
  router.get("/hashtag", async (req, res, next) => {
    // API 요청 시 한글이 포함된 경우 : formdata가 아닐 경우 encodeURIComponent - decodeURIComponent 처리
    const query = decodeURIComponent(req.query.hashtag);
    if (!query) {
      return res.redirect("/");
    }
    try {
      const hashtag = await Hashtag.findOne({ where: { title: query } });
      let posts = [];
      if (hashtag) {
        posts = await hashtag.getPosts({ include: [{ model: User, attributes: ["id", "nick"] }] });
      }
      return res.render("main", {
        title: `#${query} 검색 결과 | NodeBird`,
        twits: posts,
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

  module.exports = router;
  ```

### 업로드한 이미지 제공하기

- express.static 미들웨어로 uploads 폴더에 저장된 이미지 제공
  - 프론트엔드에서는 `/img/이미지명` 주소로 이미지 접근 가능
- `app.js`

  ```jsx
  // ..
  const pageRouter = require("./routes/page");
  const authRouter = require("./routes/auth");
  const postRouter = require("./routes/post");
  const userRouter = require("./routes/user");
  const { sequelize } = require("./models");
  const passportConfig = require("./passport");

  // ..
  app.use(morgan("dev"));
  app.use(express.static(path.join(__dirname, "public")));
  app.use("/img", express.static(path.join(__dirname, "uploads"))); // multer img upload를 위함
  app.use(express.json());

  // ..
  app.use("/", pageRouter);
  app.use("/auth", authRouter); // http://localhost:8001/auth/
  app.use("/post", postRouter); // http://localhost:8001/post/
  app.use("/user", userRouter); // http://localhost:8001/user/

  // ..
  ```

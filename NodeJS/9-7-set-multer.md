# multer 사용하기

### 이미지 업로드 구현

- form 태그의 enctype이 multipart/form-data

  - body-parser로는 요청본문을 해석할 수 없음
  - multer 패키지 필요

    ```bash
    $ npm i multer
    ```

  - 이미지를 먼저 업로드하고, 이미지가 저장된 경로를 반환할 것임
  - 게시글 form을 submit할 때는 이미지 자체 대신 경로를 전송

### 이미지 업로드 라우터 구현

- fs.readdir, fs.mkdirSync로 upload 폴더가 없으면 생성
- multer() 함수로 업로드 미들웨어 생성
  - storage: diskStorage는 이미지를 서버 디스크에 저장
    (destination은 저장 경로, filename은 저장 파일명)
  - limits는 파일 최대 용량(5MB)
  - upload.single('img'): 요청 본문의 img에 담긴 이미지 하나를 읽어 설정대로 저장하는 미들웨어
  - 저장된 파일에 대한 정보는 req.file 객체에 담긴다.
- `routes/post.js`

  ```jsx
  const express = require("express");
  const multer = require("multer");
  const path = require("path");
  const fs = require("fs");

  const { Post, Hashtag } = require("../models");
  const { isLoggedIn } = require("./middlewares");

  const router = express.Router();

  try {
    fs.readdirSync("uploads");
  } catch (err) {
    console.error("upload 폴더가 없어 uploads 폴더를 생성합니다.");
    fs.mkdirSync("uploads");
  }

  // upload 객체 안에 다양한 미들웨어가 포함된다.
  const upload = multer({
    storage: multer.diskStorage({
      destination(req, file, cb) {
        cb(null, "uploads/");
      },
      filename(req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, path.basename(file.originalname, ext) + Date.now() + ext); // 이름 중복을 예방하기 위함
      },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
  });

  // POST /img
  router.post("/img", isLoggedIn, upload.single("img"), (req, res) => {
    console.log(req.file);
    res.json({ url: `/img/${req.file.filename}` }); // 실제 파일은 uploads에, 요청은 /img/~ : express.static이 처리해준다.
  });

  module.exports = router;
  ```

### 게시글 등록

- `routes/post.js`

  ```jsx
  const express = require("express");
  const multer = require("multer");
  const path = require("path");
  const fs = require("fs");

  const { Post, Hashtag } = require("../models");
  const { isLoggedIn } = require("./middlewares");

  const router = express.Router();

  // POST /post - img upload 하지 않음
  router.post("/", isLoggedIn, upload.none(), async (req, res, next) => {
    try {
      const post = await Post.create({
        content: req.body.content,
        img: req.body.url,
        UserId: req.user.id,
      });
      // 게시글 등록 code..
      res.redirect("/");
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

  module.exports = router;
  ```

  ```

  ```

### 게시글 등록

- `upload2.none()`은 `multipart/formdata` 타입의 요청이지만 이미지는 없을 때 사용
  - 게시글 등록 시 아까 받은 이미지 경로 저장
  - 게시글에서 해시태그를 찾아서 게시글과 연결(post.addHashtags)
  - findOrCreate는 기존에 해시태그가 존재하면 그걸 사용하고, 없다면 생성하는 시퀄라이즈 메서드
- `routes/page.js`

  ```jsx
  // ..
  // POST /post - img upload 하지 않음
  router.post("/", isLoggedIn, upload.none(), async (req, res, next) => {
    try {
      const post = await Post.create({
        content: req.body.content,
        img: req.body.url,
        UserId: req.user.id,
      });
      const hashtags = req.body.content.match(/#[^\s#]*/g);
      // [#비키 #노드] > [비키 노드] >
      // [findOrCreate(비키), findOrCreate(노드)] : 중복 저장 방지(저장되어 있으면 조회, 저장되어있지 않으면 생성)
      // [[해시태그, true], [해시태그, true]]
      if (hashtags) {
        const result = await Promise.all(
          hashtags.map((tag) =>
            Hashtag.findOrCreate({
              where: { title: tag.slice(1).toLowerCase() },
            })
          ) // Hashtag.upsert 도 있다.
        );
        await post.addHashtags(result.map((r) => r[0]));
      }
      res.redirect("/");
    } catch (err) {
      console.error(err);
      next(err);
    }
  });
  ```

### 메인 페이지에 게시글 보여주기

- 메인페이지(/) 요청 시 게시글을 먼저 조회한 후 템플릿 엔진 렌더링
  - include로 관계가 있는 모델을 합쳐서 가져올 수 있음
  - Post와 User는 관계가 있음(1대다)
  - 게시글을 가져올 때 게시글 작성자까지 같이 가져오는 것
- `routes/page.js`

  ```jsx
  const express = require("express");
  const { Post, User } = require("../models");
  const router = express.Router();

  router.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.follwerCount = 0;
    res.locals.followingCount = 0;
    res.locals.followerIdList = [];
    next();
  });

  // ...

  router.get("/", async (req, res, next) => {
    try {
      res.locals.user = req.user;
      const posts = await Post.findAll({
        include: {
          model: User,
          attributes: ["id", "nick"],
        },
        order: [["createdAt", "DESC"]],
      });
      res.render("main", {
        title: "NodeBird",
        twits: posts,
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

  module.exports = router;
  ```

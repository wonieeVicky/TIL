# 몽구스 프로젝트 실행

### 라우터 작성하기

- 프론트엔드 코드는 서버에 요청을 보내는 AJAX 요청 위주로
- 서버 코드는 응답을 보내는 라우터 위주로 살펴보자

  `routes/index.js`

  ```jsx
  const express = require("express");
  const User = require("../schemas/user");

  const router = express.Router();

  router.get("/", async (req, res, next) => {
    try {
      const users = await User.find({});
      res.render("mongoose", { users });
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

  module.exports = router;
  ```

### 사용자, 댓글 라우터 설정

- router get, post, put, patch, delete 라우터 작성

  `routes/users.js`

  ```jsx
  const express = require("express");
  const User = require("../schemas/user");
  const Comment = require("../schemas/comment");

  const router = express.Router();

  router
    .route("/")
    .get(async (req, res, next) => {
      try {
        const users = await User.find({});
        res.json(users);
      } catch (err) {
        console.error(err);
        next(err);
      }
    })
    .post(async (req, res, next) => {
      try {
        const user = await User.create({
          name: req.body.name,
          age: req.body.age,
          married: req.body.married,
        });
        console.log(user);
        res.status(201).json(user);
      } catch (err) {
        console.error(err);
        next(err);
      }
    });

  router.get("/:id/comments", async (req, res, next) => {
    try {
      const comments = await Comment.find({ commenter: req.params.id }).populate("commenter");
      console.log(comments);
      res.json(comments);
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

  module.exports = router;
  ```

  `routes/comments.js`

  ```jsx
  const express = require("express");
  const Comment = require("../schemas/comment");

  const router = express.Router();

  router.post("/", async (req, res, next) => {
    try {
      const comment = await Comment.create({
        commenter: req.body.id,
        comment: req.body.comment,
      });
      console.log(comment);
      const result = await Comment.populate(comment, { path: "commenter" });
      res.status(201).json(result);
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

  router
    .route("/:id")
    .patch(async (req, res, next) => {
      try {
        const result = await Comment.update(
          {
            _id: req.params.id,
          },
          {
            comment: req.body.comment,
          }
        );
        res.json(result);
      } catch (err) {
        console.error(err);
        next(err);
      }
    })
    .delete(async (req, res, next) => {
      try {
        const result = await Comment.remove({ _id: req.params.id });
        res.json(result);
      } catch (err) {
        console.error(err);
        next(err);
      }
    });

  module.exports = router;
  ```

### 라우터 연결하기

- app.js에 연결

  `app.js`에 연결

  ```jsx
  const express = require("express");
  const path = require("path");
  const morgan = require("morgan");
  const nunjucks = require("nunjucks");

  const connect = require("./schemas");
  const indexRouter = require("./routes/index");
  const usersRouter = require("./routes/users");
  const commentsRouter = require("./routes/comments");

  const app = express();
  // ...

  // router 연결
  app.use("/", indexRouter);
  app.use("/users", usersRouter);
  app.use("/comments", commentsRouter);

  app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
  });
  // ...
  ```

### 서버 연결하기

- npm start 후 localhost: 3000에 접속

  - 콘솔에 찍히는 몽고DB 쿼리 확인

    ```bash
    $ npm start

    > learn-mongoose@0.0.1 start
    > nodemon app

    [nodemon] 2.0.7
    [nodemon] to restart at any time, enter `rs`
    [nodemon] watching path(s): *.*
    [nodemon] watching extensions: js,mjs,json
    [nodemon] starting `node app.js`
    (node:11306) [MONGODB DRIVER] Warning: Current Server Discovery and Monitoring engine is deprecated, and will be removed in a future version. To use the new Server Discover and Monitoring engine, pass option { useUnifiedTopology: true } to the MongoClient constructor.
    (Use `node --trace-warnings ...` to show where the warning was created)
    3002 번 포트에서 대기 중
    Mongoose: users.createIndex({ name: 1 }, { unique: true, background: true })
    몽고디비 연결 성공
    ```

### routes 내 populate 기능

- populate 기능은 ObjectId를 자동으로 실제 객체로 바꿔주는 역할을 한다. 사용방법은 2가지이다.

  `routes/comments.js`

  ```jsx
  router.post("/", async (req, res, next) => {
    try {
      const comment = await Comment.create({
        commenter: req.body.id,
        comment: req.body.comment,
      });
      // populate 첫 번째 방법
      const result = await Comment.populate(comment, { path: "commenter" });
      // ..
    } catch (err) {
      // ..
    }
  });
  ```

  `routes/users.js`

  ```jsx
  router.get("/:id/comments", async (req, res, next) => {
    try {
      // populate 두 번째 방법
      const comments = await Comment.find({ commenter: req.params.id }).populate("commenter");
      // ...
    } catch (err) {
      // ...
    }
  });
  ```

### 몽구스 : 데이터 수정 시(update)

데이터 수정 시 몽고디비는 조건이 먼저 그 다음 어떻게 수정할 것인지를 나열한다.

```jsx
const result = await Comment.update(
  {
    _id: req.params.id,
  },
  {
    comment: req.body.comment,
  }
);
```

(시퀄라이즈에서는 어떻게 수정할 것인지를 먼저 그 다음 조건에 대해 나열함)

### 몽구스 : 데이터 추가 시(create)

```jsx
router.post(async (req, res, next) => {
  try {
    // 몽구스에서 데이터 추가하는 방법 - 1
    const user = await User.create({
      name: req.body.name,
      age: req.body.age,
      married: req.body.married,
    });
    console.log(user);
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    next(err);
  }
});
```

```jsx
router.post(async (req, res, next) => {
  try {
    // 몽구스에서 데이터 추가하는 방법 - 2
    const user = new User({
      name: req.body.name,
      age: req.body.age,
      married: req.body.married,
    });
    await user.save();
    console.log(user);
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    next(err);
  }
});
```

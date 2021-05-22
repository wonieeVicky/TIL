# sequelize 실습

### 쿼리 수행하기

프로젝트에서 db를 처음 생성할 때에는 `npx sequelize db:create`라는 명령어를 사용한다.

```bash
$ npx sequelize db:create

Sequelize CLI [Node: 15.2.0, CLI: 6.2.0, ORM: 6.6.2]

Loaded configuration file "config/config.json".
Using environment "development".
Database nodejs created.
```

이후 `app.js`에서 sequelize.sync() 처리를 해주면 npm start 동작 시 알아서 테이블 데이터가 생성된다. 워크벤치에서 새로고침하면 생성된 테이블을 확인할 수 있다.

`app.js`

```jsx
// ...
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("데이터베이스 연결 성공");
  })
  .catch((err) => {
    console.error(err);
  });
// ...
```

`CREATE TABLE IF NOT EXISTS` : 테이블이 존재하지 않으면 생성한다.

### users 라우터

- get, post, delete, patch 같은 요청에 대한 라우터 연결
- 데이터는 JSON 형식으로 응답
- Comments 라우터도 동일

`routes/users.js`

```jsx
const express = require("express");
const User = require("../models/user");
const Comment = require("../models/comment");

const router = express.Router();

router
  .route("/")
  .get(async (req, res, next) => {
    try {
      const users = await User.findAll();
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
    const comments = await Comment.findAll({
      include: {
        model: User,
        where: { id: req.params.id },
      },
    });
    console.log(comments);
    res.json(comments);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
```

### comments 라우터

`routes/comments.js`

```jsx
const express = require("express");
const { Comment, User } = require("../models");

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    // 만약 id와 comment를 독립적으로 등록시켜줘야할 경우
    /* const user = await User.findOne({ where: { id: req.body.id } });
    const comment = await Comment.create({
      comment: req.body.comment,
    });
    const userComment = await user.addComment(comment);
    console.log(userComment);
    res.status(201).json(userComment); */

    const comment = await Comment.create({
      commenter: req.body.id,
      comment: req.body.comment,
    });
    console.log(comment);
    res.status(201).json(comment);
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
          comment: req.body.comment,
        },
        {
          where: { id: req.params.id },
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
      const result = await Comment.destroy({ where: { id: req.params.id } });
      res.json(result);
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

module.exports = router;
```

### npm start로 서버시작

- localhost:3000으로 접속하면 시퀄라이즈가 수행하는 SQL 문이 콘솔에 찍힌다.

```bash
$ npm start

> learn-sequelize@0.0.1 start /Users/uneedcomms/study/TIL/NodeJS/lecture/7.6
> nodemon app

[nodemon] 2.0.7
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node app.js`
3001 번 포트에서 대기 중
Executing (default): CREATE TABLE IF NOT EXISTS `users` (`id` INTEGER NOT NULL auto_increment , `name` VARCHAR(20) NOT NULL UNIQUE, `age` INTEGER UNSIGNED NOT NULL, `married` TINYINT(1) NOT NULL, `comment` TEXT, `created_at` DATETIME NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE utf8_general_ci;
Executing (default): SHOW INDEX FROM `users` FROM `nodejs`
Executing (default): CREATE TABLE IF NOT EXISTS `comments` (`id` INTEGER NOT NULL auto_increment , `comment` VARCHAR(100) NOT NULL, `created_at` DATETIME, `commenter` INTEGER, PRIMARY KEY (`id`), FOREIGN KEY (`commenter`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_general_ci;
Executing (default): SHOW INDEX FROM `comments` FROM `nodejs`
데이터베이스 연결 성공
```

자바스크립트 코드가 SQL로 어떻게 변하는지 `Executing (default)`문구를 보면 대충 알 수 있다. 물음표는 보안상 위험한 데이터를 가리는 것이므로 참고할 것..!

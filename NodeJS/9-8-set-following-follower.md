# 팔로잉, 팔로워 구현

### 팔로잉 기능 구현

- POST /:id/follow 라우터 추가
  - /userId/follow
  - 사용자 아이디는 req.params.id로 접근
  - user.addFollowing(사용자아이디)로 팔로잉하는 사람 추가
- `routes/user.js`

  ```jsx
  const express = require("express");
  const { isLoggedIn } = require("./middlewares");
  const User = require("../models/user");

  const router = express.Router();

  router.post("/:id/follow", isLoggedIn, async (req, res, next) => {
    try {
      const user = await User.findOne({ where: { id: req.user.id } });
      if (user) {
        await user.addFollowings(parseInt(req.params.id, 10));
        res.send("success");
      } else {
        res.status(404).send("no user");
      }
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

  module.exports = router;
  ```

### 팔로잉 기능 구현

- deserializeUser 수정
  - req.user.Followers로 팔로워 접근 가능
  - req.user.Followings로 팔로잉 접근
  - 단, 목록이 유출되면 안 되므로 팔로워/팔로잉 숫자만 프론트로 전달
- `passport/index.js`

  ```jsx
  const passport = require("passport");
  const local = require("./localStrategy");
  const kakao = require("./kakaoStrategy");
  const User = require("../models/user");

  module.exports = () => {
    passport.serializeUser((user, done) => {
      done(null, user.id); // 세션에 user의 id만 저장
    });
    // {id: 3, connect.sid: 1231ad9adkfaldfka }
    passport.deserializeUser((id, done) => {
      User.findOne({
        where: { id },
        include: [
          { model: User, attributes: ["id", "nick"], as: "Followers" },
          { model: User, attributes: ["id", "nick"], as: "Followings" },
        ],
      })
        .then((user) => done(null, user)) // req.user, req.isAuthenticated()
        .catch((err) => done(err));
    });
    local();
    kakao();
  };
  ```

- `routes/page.js`

  ```jsx
  // ..
  router.use((req, res, next) => {
    res.locals.user = req.user; // req.user 정보는 passport.deserializeUser에서 온다.
    res.locals.followerCount = req.user ? req.user.Followers.length : 0;
    res.locals.followingCount = req.user ? req.user.Followings.length : 0;
    res.locals.followerIdList = req.user ? req.user.Followings.map((f) => f.id) : [];
    next();
  });
  // ..
  ```

- `app.js`

  ```jsx
  // ..
  const userRouter = require("./routes/user");
  // ..
  app.use("/user", userRouter);
  // ..
  ```

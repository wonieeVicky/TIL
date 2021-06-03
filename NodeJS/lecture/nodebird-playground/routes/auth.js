const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const User = require("../models/user");

const router = express.Router();

// 회원가입(join) : 로그인을 안 한 상태여야 하므로 isNotLoggedIn
router.post("/join", isNotLoggedIn, async (req, res, next) => {
  const { email, nick, password } = req.body;
  try {
    const exUser = await User.findOne({ where: { email } });
    if (exUser) {
      return res.redirect("/join?error=exist"); // 이미 가입한 이메일
    }
    const hash = await bcrypt.hash(password, 12); // 숫자가 높을수록 보안성은 높아지지만, 소요시간은 오래걸린다.(trade off)
    await User.create({
      email,
      nick,
      password: hash, // hash로 변환한 비밀번호를 저장한다.
    });
    return res.redirect("/");
  } catch (err) {
    console.err(err);
    return next(error);
  }
});

// 로그인(login) : 로그인을 안 한 상태여야 하므로 isNotLoggedIn
router.post("/login", isNotLoggedIn, (req, res, next) => {
  // req.user : 사용자 정보가 없음
  passport.authenticate("local", (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.redirect(`/?loginError=${info.message}`);
    }
    return req.login(user, (loginError) => {
      // passport index.js 실행
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      // 세션 쿠키를 브라우저로 보내준다.
      return res.redirect("/");
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙인다.
});

// 로그인 한 사람만 로그아웃 해야 하므로 isLoggedIn
router.get("/logout", isLoggedIn, (req, res) => {
  // req.user : 사용자 정보가 있음
  req.logout();
  req.session.destroy;
  res.redirect("/");
});

module.exports = router;

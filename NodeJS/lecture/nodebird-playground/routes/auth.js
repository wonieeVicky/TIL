const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const User = require("../models/user");

const router = express.Router();

// 회원가입(join)
router.post("/join", async (req, res, next) => {
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

// 로그인(login)
router.post("/login", (req, res, next) => {
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

router.get("/logout", isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy;
  res.redirect("/");
});

module.exports = router;

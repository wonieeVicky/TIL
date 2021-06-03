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
    User.findOne({ where: { id } })
      .then((user) => done(null, user)) // req.user, req.isAuthenticated()
      .catch((err) => done(err));
  });
  local();
  kakao();
};

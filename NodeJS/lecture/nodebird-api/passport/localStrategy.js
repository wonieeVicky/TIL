const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const User = require("../models/user");

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email", // req.body.email
        passwordField: "password", // req.body.password
      },
      async (email, password, done) => {
        try {
          const exUser = await User.findOne({ where: { email } });
          if (exUser) {
            const result = await bcrypt.compare(password, exUser.password); // true or false
            if (result) {
              done(null, exUser); // response로 user 객체 보내준다.
            } else {
              done(null, false, { message: "비밀번호가 일치하지 않습니다. " });
            }
          } else {
            done(null, false, { message: "가입되지 않은 회원입니다." });
          }
        } catch (err) {
          console.error(err);
          done(err);
        }
      }
    )
  );
};

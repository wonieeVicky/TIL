import passport from "passport";
import { Strategy } from "passport-local";

interface Option {
  usernameField: string;
  passwordField: string;
  passReqToCallback?: false;
}
interface OptionWithReq {
  usernameField: string;
  passwordField: string;
  passReqToCallback?: true;
}

interface Done {
  (err: unknown | null, user?: Express.User | false, info?: unknown): void;
}
interface Callback {
  (userId: string, password: string, done: Done): void;
}
interface CallbackWithReq {
  (req: Express.Request, userId: string, password: string, done: Done): void;
}
declare class S {
  constructor(option: Option, callback: Callback);
  constructor(option: OptionWithReq, callback: CallbackWithReq);

  authenticate(): void;
}

const s: S = new S(
  {
    usernameField: "userId",
    passwordField: "password",
    passReqToCallback: true,
  },
  async (req, userId, password, done) => {
    try {
      return done(null, false, { message: "비밀번호가 틀렸습니다." });
    } catch (err) {
      console.error(err);
      return done(err);
    }
  }
);

export default () => {
  passport.use("local", s);
};

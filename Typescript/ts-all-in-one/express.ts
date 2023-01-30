import express, { Request, Response, NextFunction, RequestHandler, ErrorRequestHandler } from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", express.static("./public"));
app.use(cookieParser("SECRET"));
app.use(session({ secret: "SECRET" }));
app.use(passport.initialize());
app.use(passport.session());

type R = Express.Request;

const middleware: RequestHandler<
  { paramType: string },
  { message: string },
  { bodyType: number },
  { queryType: boolean },
  { localType: unknown }
> = (req, res, next) => {
  req.vicky = "vicky"; // Ok
  req.params.paramType; // string
  req.body.bodyType; // number
  req.query.queryType; // boolean
  res.locals.localType; // unknown
  res.json({
    message: "hello", // string
  });

  req.cookies;
  req.session;
  req.isAuthenticated();
  req.user?.vicky;
};

app.get("/", middleware);

const errMiddleware: ErrorRequestHandler = (err: Error, req, res, next) => {
  console.log(err.status);
};

app.use(errMiddleware);

app.listen(8080, () => {});

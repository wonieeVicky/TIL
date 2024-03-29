﻿import express, { RequestHandler, ErrorRequestHandler } from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import flash from "connect-flash";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", express.static("./public"));
app.use(cookieParser("SECRET"));
app.use(session({ secret: "SECRET" }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

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

  req.flash("플래시메시지");
  req.flash("1회성", "플래시메시지");
  const a = req.flash(); // [key: string]: string[];
  req.flash();
};

app.get("/", middleware);

const errMiddleware: ErrorRequestHandler = (err: Error, req, res, next) => {
  console.log(err.status);
};

app.use(errMiddleware);

app.listen(8080, () => {});

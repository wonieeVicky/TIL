import express, { Request, Response, NextFunction, RequestHandler } from "express";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", express.static("./public"));

declare global {
  namespace Express {
    interface Response {
      vicky: string;
    }
    interface Request {
      vicky: string;
    }
  }
}

const middleware: RequestHandler<
  { paramType: string },
  { message: string },
  { bodyType: number },
  { queryType: boolean },
  { localType: unknown }
> = (req, res, next) => {
  req.params.paramType; // string
  req.body.bodyType; // number
  req.query.queryType; // boolean
  res.locals.localType; // unknown
  res.json({
    message: "hello", // string
  });
};

app.get("/", (req, res) => {});

app.use((err, req, res, next) => {
  console.log(err.status);
});

app.listen(8080, () => {});

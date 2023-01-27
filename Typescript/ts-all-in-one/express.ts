import express, { Request, Response, NextFunction } from "express";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", express.static("./public"));

interface ResponseTest extends Response {
  vicky: string;
}

const middleware = (req: Request, res: ResponseTest, next: NextFunction) => {
  res.vicky;
};

app.get("/", (req, res) => {});

app.use((err, req, res, next) => {
  console.log(err.status);
});

app.listen(8080, () => {});

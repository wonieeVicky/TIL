# winston, helmet, hpp 사용하기

- console.log와 console.error를 대체하기 위한 모듈

  - 위 두 메서드는 휘발성(서버 껐다 키면 모두 사라져버린다)
  - 로그를 파일에 기록하는 것이 좋다. (언제 재시작될지 모르므로)
  - 윈스턴 설치 후 `logger.js` 작성

    ```bash
    $ npm i winston
    ```

    ```jsx
    const { createLogger, format, transports } = require("winston");

    // console.log -> info -> warn -> error
    const logger = createLogger({
      level: "info", // info 이상의 로그를 기록으로 남긴다.
      format: format.json(),
      transports: [
        new transports.File({ filename: "combined.log" }),
        new transports.File({ filename: "error.log", level: "error" }), // error만 따로 기록
      ],
    });

    if (process.env.NODE_ENV !== "production") {
      logger.add(new transports.Console({ format: format.simple() }));
    }

    module.exports = logger;
    ```

- 단 요즘은 aws나 gcp에서 자체적으로 console을 기록으로 남기기 때문에(클라우드 와치, 스택드라이버) 별도로 winston을 사용하지 않아도 되는 경우가 생기고 있음

### winston 적용하기

- `app.js`와 연결

  ```jsx
  // ..
  const { sequelize } = require("./models");
  const passportConfig = require("./passport");
  const logger = require("./logger");

  // ..
  app.use("/", pageRouter);
  app.use("/auth", authRouter);
  app.use("/post", postRouter);
  app.use("/user", userRouter);

  app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    logger.info("hello"); // winston
    logger.error(error.message); // winston
    next(error);
  });

  // ..
  ```

### winston 로그 확인하기

- `npm run dev`로 개발용 서버 실행

  - http://localhost:8001/abcd 에 접속
  - 각각의 로그가 파일에 기록된다.

    `combined.log`

    ```jsx
    { "message" : "hello", "level" : "info" }
    { "message" : "GET /abcd 라우터가 없습니다.", "level": "error" }
    ```

    `error.log`

    ```jsx
    { "message" : "GET /abcd 라우터가 없습니다.", "level": "error" }
    ```

  - 파일에 로그가 저장되어 관리 가능
  - `winston-daily-rotate-file` 이라는 패키지로 날짜별로 관리 가능

### helmet, hpp로 보안 관리하기

- 모든 취약점을 방어해주진 않지만 실무에서 필수인 패키지

  ```bash
  $ npm i helmet hpp
  ```

- 배포 환경일 때만 사용하면 된다.

  `app.js`

  ```jsx
  // ..
  const passport = require("passport");
  const helmet = require("helmet");
  const hpp = require("hpp");

  // ..
  if (process.env.NODE_ENV === "production") {
    app.use(morgan("combined"));
    app.enable("trust proxy");
    app.use(helmet({ contentSecurityPolicy: false })); // false로 설정해야 오류가 덜 남
    app.use(hpp());
  } else {
    app.use(morgan("dev"));
  }

  // ..
  ```

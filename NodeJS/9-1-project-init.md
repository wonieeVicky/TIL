# 노드버드 프로젝트 구조 셋팅

### NodeBird SNS 서비스

- 기능: 로그인, 이미지 업로드, 게시글 작성, 해시태그 검색, 팔로잉
  - express-generator 대신 직접 구조를 갖춤
  - 프론트엔드 코드보다 노드 라우터 중심으로 볼 것
  - 관계형 데이터베이스 MySQL 선택

### 프로젝트 시작하기

- nodebird 폴더 만들고 package.json 파일 생성

  `lecture/nodebird-playground`

  ```json
  {
    "name": "nodebird-playground",
    "version": "1.0.0",
    "description": "",
    "main": "app.js",
    "scripts": {
      "start": "nodemon app"
    },
    "author": "Vicky",
    "license": "MIT"
  }
  ```

- 시퀄라이즈 폴더 구조 생성

  - 기타 패키지 설치와 nodemon
    - nodemon은 서버 코드가 변경되었을 때 자동으로 서버를 재시작해줌
    - nodemon은 콘솔 명령어이기 때문에 글로벌로 설치

  ```bash
  $ npm i -D nodemon
  $ npm i sequelize mysql2 sequelize-cli
  $ cookie-parser express express-session morgan nunjucks dotenv multer
  $ npx sequelize init
  ```

### 폴더 구조 설정

- views(템플릿 엔진), routes(라우터), public(정적파일), passport(패스포트) 폴더 생성
  - app.js와 .env 파일도 생성

### app.js 설정

- 노드 서버의 핵심인 app.js 파일 작성

  - 소스코드는 [여기](https://github.com/ZeroCho/nodejs-book/blob/master/ch9/9.1/nodebird)에서 확인, .env도 같이 추가한다.
  - `app.js`

  ```jsx
  const express = require("express");
  const cookieParser = require("cookie-parser");
  const morgan = require("morgan");
  const path = require("path");
  const session = require("express-session");
  const nunjucks = require("nunjucks");
  const dotenv = require("dotenv");

  dotenv.config();
  const pageRouter = require("./routes/page");

  const app = express();
  app.set("port", process.env.PORT || 8001);
  app.set("view engine", "html");
  nunjucks.configure("views", {
    express: app,
    watch: true,
  });

  app.use(morgan("dev"));
  app.use(express.static(path.join(__dirname, "public")));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser(process.env.COOKIE_SECRET));
  app.use(
    session({
      resave: false,
      saveUninitialized: false,
      secret: process.env.COOKIE_SECRET,
      cookie: {
        httpOnly: true,
        secure: false,
      },
    })
  );
  app.use("/", pageRouter);

  app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  });

  // next는 반드시 존재해야 한다.
  app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
    res.status(err.status || 500).render("error");
  });

  app.listen(app.get("port"), () => {
    console.log(app.get("port"), "번 포트에서 대기 중");
  });
  ```

### 라우터 생성

- 각 페이지별 라우터를 routes/pages.js에 생성
  - routes/page.js : 템플릿 엔진을 렌더링하는 라우터
- 각 페이지 뷰를 넌적스로 생성
  - views/layout.html : 프론트엔드 화면 레잉아웃(로그인/유저 정보 화면)
  - views/main.html : 메인화면(게시글들이 보인다)
  - views/profile.html : 프로필 화면(팔로잉 관계가 보인다)
  - views/error.html : 에러 발생 시 에러가 표시될 화면
- 기타 화면 관련 소스는 public 폴더에 추가
  - public/main.css : 화면 CSS
- `npm start`로 서버 실행 후 [http://localhost:8001](http://localhost:8001) 접속

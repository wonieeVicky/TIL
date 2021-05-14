# 시퀄라이즈 사용하기

### 시퀄라이즈 ORM

- MySQL 작업을 쉽게 할 수 있도록 도와주는 라이브러리
  - ORM: Object Relational Mapping: 객체와 데이터를 매핑(1대 1 짝지음)
  - MySQL 외에도 다른 RDB(Maria, Postgre, SQLite, MSSQL)와도 호환됨
  - 자바스크립트 문법으로 데이터베이스 조작 가능
- 시퀄라이즈 예제는 [여기](https://github.com/zerocho/nodejs-book/tree/master/ch7/7.6/learn-sequelize)에서 확인

  - 프로젝트 세팅 후, 콘솔을 통해 경로로 이동한 후 package.json 작성

    ```json
    {
      "name": "learn-sequelize",
      "version": "0.0.1",
      "description": "",
      "main": "app.js",
      "scripts": {
        "start": "nodemon app"
      },
      "author": "vicky",
      "license": "MIT"
    }
    ```

### 시퀄라이즈 CLI 사용하기

- 시퀄라이즈 명령어 사용하기 위해 sequelize-cli 설치

  - mysql2는 MySQL DB가 아닌 드라이브(Node.js와 MySQL을 이어주는 역할)

    ```bash
    $ npm i express morgan nunjucks sequelize sequelize-cli mysql2
    $ npm i -D nodemon
    ```

- npx sequelize init으로 시퀄라이즈 구조 생성

  - `config`, `models`, `migrations`, `seeders` 폴더 생성

  ```bash
  $ npx sequelize init

  Sequelize CLI [Node: 15.2.0, CLI: 6.2.0, ORM: 6.6.2]

  Created "config/config.json"
  Successfully created models folder at "/Users/uneedcomms/study/TIL/NodeJS/lecture/7.6/models".
  Successfully created migrations folder at "/Users/uneedcomms/study/TIL/NodeJS/lecture/7.6/migrations".
  Successfully created seeders folder at "/Users/uneedcomms/study/TIL/NodeJS/lecture/7.6/seeders".
  ```

### models/index.js 수정

- 다음과 같이 수정

  - require(../config/config) 설정 로딩
  - new Sequelize(옵션들..)로 DB와 연결 가능

  ```jsx
  const Sequelize = require("sequelize");
  const env = process.env.NODE_ENV || "development";
  const config = require(__dirname + "/../config/config.json")[env];
  const db = {};

  // sequelize 여러 개 생성 가능
  const sequelize = new Sequelize(config.database, config.username, config.password, config);

  db.sequelize = sequelize;

  module.exports = db;
  ```

### config/config.js 수정

- "development" 를 다음과 같이 수정

  ```jsx
  {
    "development": {
      "username": "root",
      "password": "nodejspwd", // 수정
      "database": "nodejs", // 수정
      "host": "127.0.0.1",
      "dialect": "mysql"
    },
    "test": {
      "username": "root",
      "password": null,
      "database": "database_test",
      "host": "127.0.0.1",
      "dialect": "mysql"
    },
    "production": {
      "username": "root",
      "password": null,
      "database": "database_production",
      "host": "127.0.0.1",
      "dialect": "mysql"
    }
  }
  ```

### MySQL 연결하기

- app.js 작성

  - sequelize.sync 연결 ⇒ 데이터베이스 연결 성공

    ```jsx
    const express = require("express");
    const path = require("path");
    const morgan = require("morgan");
    const nunjucks = require("nunjucks");

    const { sequelize } = require("./models");

    const app = express();
    app.set("port", process.env.PORT || 3001);
    app.set("view engine", "html");
    nunjucks.configure("views", {
      express: app,
      watch: true,
    });
    sequelize
      .sync({ force: false })
      .then(() => {
        console.log("데이터베이스 연결 성공");
      })
      .catch((err) => {
        console.error(err);
      });

    app.use(morgan("dev"));
    app.use(express.static(path.join(__dirname, "public")));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    app.use((req, res, next) => {
      const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
      error.status = 404;
      next(error);
    });

    app.use((err, req, res, next) => {
      res.locals.message = err.message;
      res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
      res.status(err.status || 500);
      res.render("error");
    });

    app.listen(app.get("port"), () => {
      console.log(app.get("port"), "번 포트에서 대기 중");
    });
    ```

### 연결 테스트하기

- npm start로 실행해서 SELECT 1+1 AS RESULT가 나오면 연결성공

  ```bash
  $ npm start

  > learn-sequelize@0.0.1 start /Users/uneedcomms/study/TIL/NodeJS/lecture/7.6
  > nodemon app

  [nodemon] 2.0.7
  [nodemon] to restart at any time, enter `rs`
  [nodemon] watching path(s): *.*
  [nodemon] watching extensions: js,mjs,json
  [nodemon] starting `node app.js`
  3001 번 포트에서 대기 중
  Executing (default): SELECT 1+1 AS result
  데이터베이스 연결 성공
  ```

# 배포를 위한 패키기 설정

### 실 서비스 배포 준비하기

- 서비스 개발 시에는 localhost로 결과를 바로 볼 수 있었다.
  - 혼자만 볼 수 있기 때문에 다른 사람에게 공개하는 과정이 필요하다.
  - 9장 NodeBird 앱을 배포해본다.
- 배포를 위한 사전 작업 방법에 대해 알아본다.
  - 서버 실행 관리, 에러 내역 관리, 보안 위협 대처
  - AWS와 GCP에 배포

### morgan

- 개발용으로 설정된 익스프레스 미들웨어를 배포용으로 전환

  - process.env.NODE_ENV는 배포 환경인지 개발 환경인지를 판단할 수 있는 환경 변수이다.
  - 배포 환경일 때는 combined 사용(더 많은 사용자 정보를 로그로 남김)
  - NODE_ENV는 뒤에 나오는 cross-env에서 설정해준다.

  ```jsx
  if (process.env.NODE_ENV === "production") {
    app.use(morgan("combined"));
  } else {
    app.use(morgan("dev"));
  }
  ```

### express-session

- 설정들을 배포용과 개발용으로 분기 처리

  - production일 때는 proxy를 true, secure를 true로
  - 단, https를 적용할 경우에만 secure를 true로 하고, 노드 앞에 다른 서버를 두었을 때 proxy를 true로 함

  ```jsx
  if (process.env.NODE_ENV === "production") {
    app.use(morgan("combined"));
    app.enable("trust proxy"); // proxy 서버를 사용할 경우 아래 설정 추가
    app.use(helmet({ contentSecurityPolicy: false })); // false로 설정해야 오류가 덜 난다. (외부 스크립트 파일 호출 시 에러 발생 가능성)
    app.use(hpp());
  } else {
    app.use(morgan("dev"));
  }

  // 옵션을 미리 분리
  const sessionOption = {
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false, // https 적용한 경우 true
    },
  };

  if (process.env.NODE_ENV === "production") {
    // 배포용 옵션 분리
    sessionOption.proxy = true;
    // sessionOption.cookie.secure = true; // https 적용한 경우 주석 해제
  }

  app.use(session(sessionOption));
  ```

### sequelize

- 시퀄라이즈 설정도 하드코딩 대신 process.env로 변경
  - JSON 파일은 변수를 사용할 수 없으므로 JS 파일을 설정 파일로 써야 한다.
  - config.json을 지우고 config.js 사용
- `config/config.js`

  ```jsx
  require("dotenv").config();

  module.exports = {
    development: {
      username: "root",
      password: process.env.SEQUELIZE_PASSWORD,
      database: "nodebird",
      host: "127.0.0.1",
      dialect: "mysql",
    },
    test: {
      username: "root",
      password: process.env.SEQUELIZE_PASSWORD,
      database: "nodebird_test",
      host: "127.0.0.1",
      dialect: "mysql",
    },
    production: {
      username: "root",
      password: process.env.SEQUELIZE_PASSWORD,
      database: "nodebird",
      host: "127.0.0.1",
      dialect: "mysql",
      logging: false,
    },
  };
  ```

- `.env`

  ```jsx
  COOKIE_SECRET=nodebirdsecret
  KAKAO_ID=5d4daf57becfd72fd9c9198825512931
  SEQUELIZE_PASSWORD=12341234 // 추가
  ```

### cross-env

- 동적으로 process.env 변경 가능

  - 운영체제와 상관없이 일괄 적용 가능(mac, window, linux)
  - `package.json`을 다음과 같이 수정(배포용과 개발용 스크립트 구분)

    ```json
    {
      "name": "nodebird",
      "version": "0.0.1",
      "description": "익스프레스로 만드는 SNS 서비스",
      "main": "server.js",
      "scripts": {
        "start": "NODE_ENV=production PORT=80 node server",
        "dev": "nodemon server",
        "test": "jest"
      }
      // ...
    }
    ```

  - 문제점: 윈도우에서는 NODE_ENV를 위와 같이 설정할 수 없으므로 이 때, `cross-env`가 필요하다.

    ```bash
    $ npm start
    'NODE_ENV'은(는) 내부 또는 외부 명령, 실행할 수 있는 프로그램, 또는 배치 파일이 아닙니다.
    ```

- `cross-env` 설치 후 적용

  ```bash
  $ npm i cross-env
  ```

  - `package.json`도 수정

    ```json
    {
      // ...
      "scripts": {
        "start": "cross-env NODE_ENV=production PORT=80 pm2 start server.js -i 0",
    		// ..
    }
    ```

### sanitize-html

- XSS(Cross Site Scripting) 공격 방어

  - `npm i sanitize-html`
  - 허용하지 않는 html 입력을 막음 ⇒ DB 저장 직전에 sanitizeHtml로 걸러서 안전한 정보만 저장한다.
  - 아래처럼 빈 문자열로 치환된다.

    ```jsx
    const sanitizeHtml = require("sanitize-html");

    const html = "<script>location.href = 'https://gilbut.co.kr'</script>";
    console.log(sanitizeHtml(html)); // ''
    ```

### csurf

- CSRF(Cross Site Request Forgery) 공격 방어

  - `npm i csurf`
  - A의 요청을 B의 요청으로 속여버리는 공격을 막아준다.
  - 미들웨어로 넣어주면 되는데, csrfToken을 생성해서 프론트로 보내주고(쿠키로), Form 등록 시 csrfToken 값을 같이 받아 토큰값이 일치하는지 비교한다.

  ```jsx
  const csrf = require("csurf");
  const csrfProtection = csrf({ cookie: true });

  app.get("/form", csrfProtection, (req, res) => {
    res.render("csrf", { csrfToken: req.csrfToken() });
  });

  app.post("/form", csrfProtection, (req, res) => {
    res.send("ok");
  });
  ```

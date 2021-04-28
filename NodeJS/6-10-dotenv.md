# dotenv

### dotenv는 Node.js 기반에서 환경변수를 사용할 수 있도록 해주는 라이브러리이다.

이 라이브러리는 미리 작성해놓은 `.env`파일을 환경변수에 대신 설정해주는 기능을 가지고 있다.

```bash
$ npm i dotenv
```

초기 .env 파일을 설정은 아래와 같은 방법으로 할 수 있다.

`.env`

```jsx
COOKIE_SECRET = vickypassword;
DB_PASSWORD = vickydbpassword;
```

`app.js`

```jsx
const dotenv = require("dotenv");
dotenv.config(); // 현재 디렉토리의 .env 파일을 자동으로 인식해서 환경변수를 설정해준다.
// 혹은 .env 파일의 위치를 직접 지정할 수도 있음
// dotenv.config({ path: path.join(__dirname, "path/to/.env") });

const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const path = require("path");

const app = express();
app.use(cookieParser(process.env.COOKIE_SECRET)); // 환경변수로 COOKIE_SECRET 사용
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET, // 환경변수로 COOKIE_SECRET 사용
    cookie: {
      httpOnly: true,
      secure: false,
    },
    name: "session-cookie",
  })
);
```

dotenv 초기 설정은 최대한 위에서 선언하는 것이 좋은데, 적어도 환경변수를 사용하는 다른 라이브러리가 실행되기 전에 환경변수를 가지고 있을 수 있도록 앞서 실행시켜주는 것이 좋다.

필요에 따라 각 환경별 설정파일을 분리하여 관리할 수도 있다. (production, develop, local, test 등)

```
+ src
  - index.develop.js
  - index.local.js
  - index.production.js
  - index.test.js
  - ...
- .env.develop
- .env.local
- .env.production
- .env.test
- package.json
- ...
```

단 이렇게 하면 원하는 상황의 개수만큼 진입점 파일을 따로 작성해줘야 할수도 있어 번거롭다.

### cross-env

이럴 때는 `cross-env`라이브러리를 사용하면 좋다.  
`cross-env`는 프로그램을 CLI 환경에서 실행시킬 때 환경변수를 설정하는 기능을 가진다.

```bash
$ cross-env NODE_ENV=production node src/app.js
```

따라서 위와 같이 설정 후 `app.js`에서 `NODE_ENV`에 대한 분기처리를 해주면 1개의 진입점으로도 상황에 맞게 환경변수를 사용할 수 있게됨

```jsx
const path = require("path");
const dotenv = require("dotenv");

if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: path.join(__dirname, "path/to/.env.production") });
} else if (process.env.NODE_ENV === "develop") {
  dotenv.config({ path: path.join(__dirname, "path/to/.env.develop") });
} else {
  throw new Error("process.env.NODE_ENV를 설정하지 않았습니다!");
}
```

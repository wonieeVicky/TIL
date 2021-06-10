# API 서버 구조 갖추기

### NodeBird SNS 서비스

- 기존 nodebird 서비스의 API 서버를 만든다.
- API : Application Programming Interface

  ![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/27f72229-973f-4efa-9749-5f7ca4d5a49c/_2021-06-08__11.45.29.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/27f72229-973f-4efa-9749-5f7ca4d5a49c/_2021-06-08__11.45.29.png)

  - 다른 애플리케이션에서 현재 프로그램의 기능을 사용할 수 있게 함
  - 웹 API : 다른 웹 서비스의 기능을 사용하거나 자원을 가져올 수 있게 함
  - 다른 사람에게 **정보를 제공하고 싶은 부분만 API를 열고**, 제공하고 싶지 않은 부분은 API를 만들지 않으면 됨
  - **API에 제한을 걸어 일정 횟수 내에서만 가져가게 할 수도 있음**
  - NodeBird에서는 인증된 사용자에게만 정보 제공

### NodeBird API 폴더 세팅

- nodebird-api 폴더를 만들고 package.json 생성

  - `nodebird-api/package.json`

    ```json
    {
      "name": "nodebird-api",
      "version": "1.0.0",
      "description": "",
      "main": "app.js",
      "scripts": {
        "start": "nodemon app"
      },
      "author": "Vicky",
      "license": "MIT",
      "dependencies": {
        "bcrypt": "^5.0.1",
        "cookie-parser": "^1.4.5",
        "dotenv": "^10.0.0",
        "express": "^4.17.1",
        "express-session": "^1.17.2",
        "morgan": "^1.10.0",
        "mysql2": "^2.2.5",
        "nunjucks": "^3.2.3",
        "passport": "^0.4.1",
        "passport-local": "^1.0.0",
        "sequelize": "^6.6.2",
        "uuid": "^8.3.2"
      },
      "devDependencies": {
        "nodemon": "^2.0.7"
      }
    }
    ```

- 생성 후 npm i로 패키지 설치
- NodeBird에서 config, models, passport 모두 복사해서 nodebird-api에 붙여넣기
- routes 폴더에서는 auth.js와 middleware 재사용
- .env 파일 복사
- views 폴더를 만들고 error.html 파일 생성

  - `nodebird-api/views/error.html`

    ```html
    <h1>{{message}}</h1>
    <h2>{{error.status}}</h2>
    <pre>{{error.stack}}</pre>
    ```

### Domain 모델 생성

`models/domain.js`

```jsx
const Sequelize = require("sequelize");

module.exports = class Domain extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        host: {
          type: Sequelize.STRING(80),
          allowNull: false
        },
        type: {
          type: Sequelize.ENUM("free", "premium"), // free, premium 둘 중 하나만 쓸 수 있다.
          allowNull: false
        },
        clientSecret: {
          type: Sequelize.UUID, // Sequelize.STRING(36) 대신 UUID 포맷인지 확인하는 메서드를 사용
          allowNull: false
        }
      },
      {
        sequelize,
        timestamps: true,
        paranoid: true,
        modelName: "Domain",
        tableName: "domains"
      }
    );
  }
  static associate(db) {
    db.Domain.belongsTo(db.User);
  }
};
```

이후 `models/index.js`에 Domain 연결

또한 `models/user.js` 의 associate에 `db.User.hasMany(db.Domain);`로 연결해준다

```jsx
const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];
const User = require("./user");
const Post = require("./post");
const Hashtag = require("./hashtag");
const Domain = require("./domain");

const db = {};
const sequelize = new Sequelize(config.database, config.username, config.password, config);
db.sequelize = sequelize;
db.User = User;
db.Post = Post;
db.Hashtag = Hashtag;
db.Domain = Domain; // 추가

User.init(sequelize);
Post.init(sequelize);
Hashtag.init(sequelize);
Domain.init(sequelize); // 추가

User.associate(db);
Post.associate(db);
Hashtag.associate(db);
Domain.associate(db); // 추가

module.exports = db;
```

### domain 라우터 추가

```jsx
const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { User, Domain } = require("../models");
const { isLoggedIn } = require("./middlewares");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: (req.user && req.user.id) || null },
      include: { model: Domain }
    });
    res.render("login", {
      user,
      domains: user && user.Domains
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// 도메인 라우터
router.post("/domain", isLoggedIn, async (req, res, next) => {
  try {
    await Domain.create({
      UserId: req.user.id,
      host: req.body.host,
      type: req.body.type,
      clientSecret: uuidv4()
    });
    res.redirect("/");
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
```

### views 템플릿에 login.html 생성

`views/login.html`

```jsx
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>API 서버 로그인</title>
    <style>
      .input-group label {
        width: 200px;
        display: inline-block;
      }
    </style>
  </head>
  <body>
    {% if user and user.id %}
    <span class="user-name">안녕하세요! {{user.nick}}님</span>
    <a href="/auth/logout">
      <button>로그아웃</button>
    </a>
    <fieldset>
      <legend>도메인 등록</legend>
      <form action="/domain" method="post">
        <div>
          <label for="type-free">무료</label>
          <input type="radio" id="type-free" name="type" value="free" />
          <label for="type-premium">프리미엄</label>
          <input type="radio" id="type-premium" name="type" value="premium" />
        </div>
        <div>
          <label for="host">도메인</label>
          <input type="text" id="host" name="host" placeholder="ex) zerocho.com" />
        </div>
        <button>저장</button>
      </form>
    </fieldset>
    <table>
      <tr>
        <th>도메인 주소</th>
        <th>타입</th>
        <th>클라이언트 비밀키</th>
      </tr>
      {% for domain in domains %}
      <tr>
        <td>{{domain.host}}</td>
        <td>{{domain.type}}</td>
        <td>{{domain.clientSecret}}</td>
      </tr>
      {% endfor %}
    </table>
    {% else %}
    <form action="/auth/login" id="login-form" method="post">
      <h2>NodeBird 계정으로 로그인하세요.</h2>
      <div class="input-group">
        <label for="email">이메일</label>
        <input id="email" type="email" name="email" required autofocus />
      </div>
      <div class="input-group">
        <label for="password">비밀번호</label>
        <input id="password" type="password" name="password" required />
      </div>
      <div>회원가입은 localhost:8001에서 하세요.</div>
      <button id="login" type="submit">로그인</button>
    </form>
    <script>
      window.onload = () => {
        if (new URL(location.href).searchParams.get("loginError")) {
          alert(new URL(location.href).searchParams.get("loginError"));
        }
      };
    </script>
    {% endif %}
  </body>
</html>
```

이후 npm start 로 localhost:8002를 열어 확인해보면 정상적으로 로그인이 되는 것을 확인할 수 있다.

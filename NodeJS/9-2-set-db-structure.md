# 데이터베이스 구조 갖추기

### 모델 생성

- 소스코드는 [여기](https://github.com/ZeroCho/nodejs-book/tree/master/ch9/9.1/nodebird)에서 참고
  - models/user.js: 사용자 테이블과 연결됨
    - provider: 카카오 로그인인 경우 kakao, 로컬 로그인(이메일/비밀번호)인 경우 local
    - snsId: 카카오 로그인인 경우 주어지는 id
  - models/post.js : 게시글 내용과 이미지 경로를 저장(이미지는 파일로 저장)
  - models/hashtag.js : 해시태그 이름을 저장(나중에 태그로 검색하기 위해서)
- config.json에 devlopment 디비 계정정보 추가 후 db 생성

  - `config/config.json`

    ```json
    {
      "development": {
        "username": "root",
        "password": "password",
        "database": "nodejs-nodebird",
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

    ```bash
    $ npx sequelize db:create

    Sequelize CLI [Node: 16.2.0, CLI: 6.2.0, ORM: 6.6.2]

    Loaded configuration file "config/config.json".
    Using environment "development".
    Database nodejs-nodebird created.
    ```

  ### models/index.js

  - 시퀄라이즈가 자동으로 생성해주는 코드 대신 다음과 같이 변경
    - 모델들을 불러옴(require)
    - 모델 간 관계가 있는 경우 관계 설정
    - User(1) : Post(다)
    - Post(다) : Hashtag(다)
    - User(다) : User(다)
  - `models/user.js`

    ```jsx
    const Sequelize = require("sequelize");

    module.exports = class User extends Sequelize.Model {
      static init(sequelize) {
        return super.init(
          {
            email: {
              type: Sequelize.STRING(40),
              allowNull: true, // null이 두 개여도 각자의 고유한 값으로 본다.
              unique: true,
            },
            nick: {
              type: Sequelize.STRING(15),
              allowNull: false,
            },
            password: {
              type: Sequelize.STRING(100), // 비밀번호 hash화 되므로 100자로 둔다.
              allowNull: true, // 비밀번호 Null? - SNS 로그인 시
            },
            provider: {
              type: Sequelize.STRING(10),
              allowNull: false,
              defaultValue: "local",
            },
            snsId: {
              type: Sequelize.STRING(30),
              allowNull: true,
            },
          },
          {
            sequelize,
            timestamps: true, // createdAt, updatedAt 기록된다.
            underscored: false,
            modelName: "User",
            tableName: "users",
            paranoid: true, // deletedAt 사용
            charset: "utf8",
            collate: "utf8_general_ci",
          }
        );
      }

      static associate(db) {
        // ...
      }
    };
    ```

  - `models/post.js`

    ```jsx
    const Sequelize = require("sequelize");

    module.exports = class Post extends Sequelize.Model {
      static init(sequelize) {
        return super.init(
          {
            // id 생략
            content: {
              type: Sequelize.STRING(140),
              allowNull: false,
            },
            img: {
              type: Sequelize.STRING(200),
              allowNull: true,
            },
          },
          {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: "Post",
            tableName: "posts",
            paranoid: false, // deletedAt 사용 X
            charset: "utf8mb4",
            collate: "utf8mb4_general_ci",
          }
        );
      }

      static associate(db) {
        // ...
      }
    };
    ```

  - `models/hashtag.js`

    ```jsx
    const Sequelize = require("sequelize");

    module.exports = class Hashtag extends Sequelize.Model {
      static init(sequelize) {
        return super.init(
          {
            title: {
              type: Sequelize.STRING(15),
              allowNull: false,
              unique: true,
            },
          },
          {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: "Hashtag",
            tableName: "hashtags",
            paranoid: false,
            charset: "utf8mb4",
            collate: "utf8mb4_general_ci",
          }
        );
      }
      static associate(db) {
        // ...
      }
    };
    ```

  - `models/index.js`

    ```jsx
    const Sequelize = require("sequelize");
    const env = process.env.NODE_ENV || "development";
    const config = require("../config/config")[env]; // config.json 내 설정파일 불러오기
    const User = require("./user");
    const Post = require("./post");
    const Hashtag = require("./hashtag");

    const db = {};
    const sequelize = new Sequelize(config.database, config.username, config.password, config);
    db.sequelize = sequelize;
    db.User = User;
    db.Post = Post;
    db.Hashtag = Hashtag;

    User.init(sequelize);
    Post.init(sequelize);
    Hashtag.init(sequelize);

    User.associate(db);
    Post.associate(db);
    Hashtag.associate(db);

    module.exports = db;
    ```

# MySQL과 시퀄라이즈 연결

이제 데이터베이스를 세팅해보자. 우리는 이번에 MySQL을 사용한다. MySQL는 공짜라서 테스트용으로 사용하고, MariaDB나, Postgre를 사용해도 좋다.

먼저 MySQL과 mysqlWorkbench를 설치하자. (Homebrew가 설치 안되어있다면 Homebrew 먼저 설치!)

```bash
$ brew install mysql
$ brew services start mysql
$ mysql_secure_installation
$ brew cask install mysqlworkbench // 혹은 brew install --cask mysqlworkbench
```

~~(에러가 나서 한참 고생했다. mysqlworkbench를 8.2.20버전으로 downgrade했더니 잘 된다..)~~

Workbench는 데이터베이스를 들여다 봐야할 때 터미널로 보는 것이 다소 어렵기 때문에, 컴퓨터에 설치되어있는 localhost DB에 접속하여 시각화된 데이터를 확인할 수 있는 툴이다.

MySQL 설치가 완료되었다면 코드로 MySQL를 조작해볼 차례다. 프로젝트에 시퀄라이즈 패키지를 설치해주자!

```bash
$ npm i sequelize sequelize-cli mysql2
$ npx sequelize init
```

MySQL도 데이터베이스를 조작하는 프로그래밍 언어이다.  
sequelize는 자바스크립트로 MySQL을 조작할 수 있도록 해주는 라이브러리이다.  
따라서 sql 문법을 모르더라도 자바스크립트로 데이터베이스를 조작해주면 시퀄라이즈가 알아서 sql 문법으로 바꿔준다. (mysql2 패키지는 node랑 MySQL를 연결해주는 드라이버이다.)

sequelize 라이브러리가 설치가 되었다면 `npx sequelize init`을 쳐서 sequelize를 초기 세팅을 해준다.

sequelize 설치가 완료되었다면 back 폴더 하위에 config, migrations, models, seeders라는 폴더들이 생긴다. 먼저 `config/config.json`에서 아래와 같이 정보를 수정해주자.

```json
{
  "development": {
    "username": "root",
    "password": "1234", // 수정
    "database": "react-nodebird", // 수정
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "react-nodebird", // 수정
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "react-nodebird", // 수정
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
```

그런 다음 back/models/index.js에도 아래와 같이 코드를 변경해준다.

`new Sequelize(config.database, config.username, config.password, config);`

위 부분이 Node와 MySQL을 mysql2를 통해 연결해주는 시작점이 된다 :)

```jsx
const Sequelize = require("sequelize");
// 환경변수 설정 - 배포할 땐 Production으로 바꿔준다.
const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];
const db = {};

// sequelize가 mysql2라는 드라이브에 아래 config정보를 넣어줘서 Node와 MySQL을 연결해준다.
const sequelize = new Sequelize(config.database, config.username, config.password, config);

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
```

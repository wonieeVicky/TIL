# 시퀄라이즈 sync와 nodemon

이제 열심히 만든 모델을 시퀄라이즈에 불러와서 연결해줄 차례이다.

`back/models/index.js`

```jsx
const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development"; // 환경변수 설정 - 배포할 땐 Production으로 바꿔준다.
const config = require("../config/config")[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

// 모델 추가
db.Comment = require("./comment")(sequelize, Sequelize);
db.Hashtag = require("./hashtag")(sequelize, Sequelize);
db.Image = require("./image")(sequelize, Sequelize);
db.Post = require("./post")(sequelize, Sequelize);
db.User = require("./user")(sequelize, Sequelize);

// 모델을 돌면서 associate에 있는 관계들을 연결해준다.
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
```

위와 같이 시퀄라이즈와 모델을 연결했다! 이제 마지막 시퀄라이즈와 express를 연결해주는 작업이 필요하다.

`back/app.js`

```jsx
const express = require("express");
const postRouter = require("./routes/post");
const db = require("./models");

const app = express();

// 서버 실행 시 db 시퀄라이즈 연결도 같이 된다.
db.Sequelize.sync()
  .then(() => {
    console.log("db 연결 성공");
  })
  .catch(console.error);

// another codes..
```

서비스의 가장 최상위가 되는 app.js에서 db를 호출하고, 시퀄라이즈를 연결해주면 된다.  
성공하면 'db 연결 성공'이라는 메시지가 뜨고, 만약 실패가 된다면 에러가 기록될 것이다.

이제 터미널에서 서버를 실행시켜보자

```bash
$ node app
```

위 코드로 서버를 실행시키면 가장 먼저 [Unknown database 'react-nodebird'] sqlMessage 를 뱉는다.  
그럴 때에는 아래의 코드로 db를 create해준다.

```bash
$ npx sequelize db:create
```

위와 같이 명렁어를 치면 Database react-nodebird created.라는 성공 메시지가 리턴된다. 그 다음 다시 `node app`을 쳐보자! 정상적으로 시퀄라이즈가 SQL문으로 바꿔서 실행해준다. 이제 Workbench에 들어가서 react-nodebird로 만들어진 테이블을 확인해보자 : )

- _만약 Access denied for user 'root'@'localhost' (using password: YES)라는 메시지가 뜬다면?_

## nodemon

노드로 코딩 시 화면 확인을 위해 계속 `node app`을 통해 서버를 재 실행시켜줘야 해서 매우 불편하다.  
그럴 때 nodemon이라는 패키지를 사용하면 좀 더 편하게 개발이 가능하다.

```bash
$ npm i -D nodemon@2
```

```bash
// package.json
{
  "name": "react-nodebird-back",
  "scripts": {
    "dev": "nodemon app"
  },
	// codes..
}
```

위와 같이 설정 후 터미널에서 npm run dev를 실행시키면 nodemon으로 노드가 실행되고, 이후 수정사항을 저장할 때마다 알아서 node app이 재실행된다. 매우 편리하다 !

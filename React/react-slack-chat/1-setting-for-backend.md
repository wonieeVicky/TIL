### background 세팅하기(feat. node, mySQL 설치)

먼저 back 소스는 준비되어있다는 가정하에 작업이 진행되므로 제반 소스 환경을 준비해준다.

1. node 14(혹은 12, 15)와 MySQL 미리 설치
2. [프로젝트 소스폴더(제로초님 깃헙)](https://github.com/ZeroCho/sleact)에서 project clone 후 back 폴더 이사
3. .env 파일에 개인 비밀번호 정보 추가

   ```
   COOKIE_SECRET=1234
   MYSQL_PASSWORD=1234
   ```

4. 관련 패키지 설치

   ```bash
   $ cd back
   $ npm i
   ```

5. config/config.json에서 MySQL 접속 설정

   ```json
   require('dotenv').config();

   module.exports = {
     "development": {
       "username": "root",
       "password": process.env.MYSQL_PASSWORD,
       "database": "sleact",
       "host": "127.0.0.1",
       "dialect": "mysql"
     },
     "test": {
       "username": "root",
       "password": process.env.MYSQL_PASSWORD,
       "database": "sleact",
       "host": "127.0.0.1",
       "dialect": "mysql"
     },
     "production": {
       "username": "root",
       "password": process.env.MYSQL_PASSWORD,
       "database": "sleact",
       "host": "127.0.0.1",
       "dialect": "mysql"
     }
   }
   ```

6. 스키마 생성 및 테이블 생성

   ```bash
   $ npx sequelize db:create

   Sequelize CLI [Node: 14.17.3, CLI: 6.2.0, ORM: 6.6.5]
   Loaded configuration file "config/config.js".
   Using environment "development".
   Database sleact created.

   $ npm run dev # 후 ctrl + c로 종료한다. 테이블 생성을 위함!
   $ npx sequelize db:seed:all # 가짜 데이터 넣기(back/seeders/*.js)

   Sequelize CLI [Node: 14.17.3, CLI: 6.2.0, ORM: 6.6.5]
   Loaded configuration file "config/config.js".
   Using environment "development".
   == 20201019065847-sleact: migrating =======
   == 20201019065847-sleact: migrated (0.141s)

   $ npm run dev # localhost:3095에서 백엔드 서버 실행
   ```

위 과정을 모두 완료한 후 localhost:3095에 접속하면 정상동작하는 것을 볼 수 있다.
현재 스텝까지를 기준으로 작업하며 백엔드 개발자가 API.md와 typings/db.ts를 남겨둔 상황이라고 판단한다.

### 노드와 MySQL 설치하기

- 노드 설치
  1. [nodejs.org/en](http://nodejs.org/en) 에서 LTS버전 다운로드 및 설치
     1. window 환경일 경우 [automatically install the necessary tools. ~ ] 옵션 활성화할 것
  2. 설치 완료 후 cmd 창에서 node라고 쳤을 때 nodejs가 실행됨. 안되면 PATH 설정 다시볼 것
- MySQL 설치
  1. [dev.mysql.com/downloads/mysql](http://dev.mysql.com/downloads/mysql) 에서 환경에 맞는 것으로 다운로드
     1. 용량 작은 것과 용량 큰 것 중 용량 큰 것을 다운로드 받을 것
  2. Choosing a Setup Type → Developer Default → MySQL Server, MySQL Workbench 만 다운로드
  3. Authentication Method → Use Legacy Authentication Method 선택
     1. MySQL 5와 호환 가능
  4. 비밀번호 입력 후 설치 완료!
     1. aksdir Authentication 에러시 mysql2 설치
  5. 설치 완료 후 cmd 창에서 mysql -uroot -p라고 쳤을 때 mysql 실행됨.
     1. ERROR 1045 (28000): Access denied for user 'uneedcomms'@'localhost' (using password: YES) 일 때
        1. `ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY "비밀번호";` 입력
     2. ERROR 1045 (28000): Access denied for user 'uneedcomms'@'localhost' (using password: NO) 일 때 `config/config.json` 설정을 다시 확인한다.

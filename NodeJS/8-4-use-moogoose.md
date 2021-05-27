# 몽구스 ODM, Schema

### 몽구스 ODM

- 몽고디비 작업을 쉽게 할 수 있도록 도와주는 라이브러리
  - ODM: Object Document Mapping : 객체와 다큐먼트를 매핑(1대 1 짝지음)
  - 몽고디비에 없어 불편한 기능들을 몽구스가 보완
  - 테이블과 유사한 기능, JOIN 기능 추가
- 몽구스 예제는 [여기](https://github.com/zerocho/nodejs-book/tree/master/ch8/8.6/learn-mongoose)에서 프로젝트 세팅 후 콘솔을 통해 경로로 이동한 뒤 package.json 설치해준다.

  `package.json`

  ```json
  {
    "name": "learn-mongoose",
    "version": "0.0.1",
    "description": "몽구스를 배우자",
    "main": "app.js",
    "scripts": {
      "start": "nodemon app"
    },
    "author": "Vicky",
    "license": "MIT"
  }
  ```

  ```bash
  $ npm i express morgan nunjucks mongoose
  $ npm i -D nodemon
  ```

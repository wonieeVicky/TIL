# 몽구스 ODM, Schema 정의

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

### 스키마 정의하기

- schemas 폴더 안에 작성

  - MySQL의 테이블처럼 정해진 데이터만 들어갈 수 있게 강제함
  - type은 자료형, require은 필수 여부, default는 기본값, unique는 고유여부를 의미한다.

  `schemas/user.js`

  ```jsx
  const mongoose = require("mongoose");
  const { Schema } = mongoose;

  // _id는 기본적으로 생성하므로 생략 가능
  const userSchema = new Schema({
    name: {
      type: String,
      required: true,
      unique: true,
    },
    age: {
      type: Number, // Int32가 아니다. 기본 자바스크립트 데이터 값을 사용해야 한다.(JSON)
      required: true,
    },
    married: {
      type: Boolean,
      required: true,
    },
    comment: String, // option이 type만 있을 때에는 간단하게 작성가능 required: false
    createdAt: {
      type: Date,
      default: Date.now, // Sequelize.NOW
    },
  });

  module.exports = mongoose.model("User", userSchema);
  ```

  `schemas/comment.js`

  ```jsx
  const mongoose = require("mongoose");

  const { Schema } = mongoose;
  const {
    Types: { ObjectId },
  } = Schema;
  const commentSchema = new Schema({
    commenter: {
      type: ObjectId,
      required: true,
      ref: "User", // User 스키마의 _id를 가리킨다.
    },
    comment: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });

  module.exports = mongoose.model("Comment", commentSchema);
  ```

  ### 몽구스를 쓰면서 스키마를 사용하는 이유?

  빅데이터나 검색엔진, 메세지, 로깅, 세션관리, IoT 등 제한적인 범위를 제외한 대부분의 상용 서비스는 구조마다 테이블마다 관계가 있어 SQL처럼 사용하게 됨. 즉 컬렉션 마다 자유로운 데이터가 들어오는 경우가 아닌 이미 규정되어진 일정한 데이터가 각자의 구조와 각 데이터마다 관계를 가지는 형태로 추가되므로 스키마가 필요하게 됨

  ### 몽구스의 populate

  ```json
  {
  	_id: ObjectId("60acd043f91162450d0d9edc"),
  	commenter: ObjectId("60accbc7f91162450d0d9eda"),
  	comment: "댓글",
  	createdAt: "2021-05-25T10:24:03.577+00:00"
  }
  ```

  `commenter`에 ObjectId를 넣고 `ref`에 User 테이블을 연결하는 방법을 몽구스의 populate 기능이라고 한다. 이 방법 말고는 `nested object` 방법이 있는데 commenter에 user 데이터가 중복으로 들어가는 방법이다. (아래 예시 코드 참조)

  ```json
  // nested Object 예시
  {
  	_id: ObjectId("60acd043f91162450d0d9edc"),
  	commenter: {
  		name: "vicky",
  		age: 32,
  		married: false,
  		comment: "안녕하세요. 비키입니다!",
  	}
  	comment: "댓글",
  	createdAt: "2021-05-25T10:24:03.577+00:00",
  }
  ```

  1. populate 방법
     - 장점: ref로 목적 테이블과 연결시켜 type에 ObjectId를 연결시킴으로서 데이터의 중복이 사라지고, 데이터 수정 시 관계된 다른 테이블의 데이터도 함께 바뀐다.
     - 단점: populate 기능은 자바스크립트로 만들어진 기능이므로 테이블을 join 하는 과정에서 비용이 많이 소요된다.
  2. nested Object 방법
     - 장점: 각 테이블에 해당 데이터가 그물처럼 함께 포함되므로 해당 데이터에 대한 접근이 빠르다.
     - 단점: 테이블마다 중복된 데이터가 발생하여 불필요한 데이터 사용이 증가하고, 데이터 수정/삭제 등이 발생할 경우 nestedObject를 찾아 모두 직접 바꿔줘야 한다. 이 또한 비용이 소요된다.

  두 방법 모두 장단점이 존재하며, 사용 적절한 것으로 골라서 사용한다 :)

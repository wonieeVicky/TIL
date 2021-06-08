# API 서버 이해하기

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

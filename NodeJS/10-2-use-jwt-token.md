# JWT 토큰 사용하기

### 인증을 위한 JWT

- NodeBird가 아닌 다른 클라이언트가 데이터를 가져가게 하려면 인증 과정이 필요함
- JWT(JSON Web Token)을 사용한다. ([여기](https://jwt.io/)에서 포맷 확인 가능)
  - 헤더.페이로드.시그니처로 구성됨
  - 헤더: 토큰 종류와 해시 알고리즘 정보가 들어있다.
  - 페이로드: 토큰의 내용물이 인코딩된 부분
  - 시그니처: 일련의 문자열로, 시그니처를 통해 토큰이 변조되었는지 여부 확인
  - 시그니처는 JWT 비밀키로 만들어지고, 비밀키가 노출되면 토큰 위조 가능(시그니처 보안 필요)

### JWT 사용 시 주의점

- JWT에 민감한 내용을 넣으면 안 됨
  - 페이로드 내용을 볼 수 있기 때문
  - 그럼에도 사용하는 이유는 토큰 변조가 불가능하고, 내용물이 들어있기 때문으로 데이터베이스 조회를 최소화할 수 있음(데이터베이스 조회는 비용이 크다)
  - 따라서 노출이 되어도 좋은 정보만 담아야하며, 용량이 큰 단점으로 인해 요청 시 데이터 양이 증가한다. (네트워크 상의 패킷 증가)

### 노드에서 JWT 사용하기

- JWT 모듈 설치

  - npm i jsonwebtoken
  - JWT 비밀키를 .env에 저장

    `nodebird-api/.env`

    ```
    COOKIE_SECRET=1234
    KAKAO_ID=1234
    JWT_SECRET=1234
    ```

  - JWT 토큰을 검사하는 verifyToken 미들웨어 작성
  - jwt.verify 메서드로 검사 가능(두 번째 인수가 JWT 비밀키)
  - JWT 토큰은 `req.header.authorization`에 들어있음
  - 만료된 JWT 토큰인 경우 419 에러 발생
  - 유효하지 않은 토큰인 경우 401 에러 발생
  - req.decoded에 페이로드를 넣어 다음 미들웨어에서 쓸 수 있게 함

    `nodebird-api/routes/middlewares.js`

    ```jsx
    const jwt = require("jsonwebtoken");

    // ...
    exports.verifyToken = (req, res, next) => {
      try {
        req.decoded = jwt.verify(req.headers.authorization, process.env.JST_SECRET);
        return next();
      } catch (err) {
        if (err.name === "TokenExpiredError") {
          // 유효기간 초과
          return res.status(419).json({
            code: 419,
            message: "토큰이 만료되었습니다"
          });
        }
        return res.status(401).json({
          code: 401,
          message: "유효하지 않은 토큰입니다."
        });
      }
    };
    ```

  ### JWT 토큰 발급 라우터 만들기

  - `routes/v1.js` 작성

    ```jsx
    const express = require("express");
    const jwt = require("jsonwebtoken");
    const { verifyToken } = require("./middlewares");
    const { Domain, User } = require("../models");

    const router = express.Router();

    // 토큰 발급
    router.post("/token", async (req, res) => {
      const { clientSecret } = req.body;
      try {
        const domain = await Domain.find({
          where: { clientSecret },
          include: {
            model: User,
            attribute: ["nick", "id"]
          }
        });
        if (!domain) {
          return res.status(401).json({
            code: 401,
            message: "등록되지 않은 도메인입니다. 먼저 도메인을 등록하세요"
          });
        }
        const token = jwt.sign(
          {
            id: domain.user.id,
            nick: domain.user.nick
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "1m", // 1분
            issuer: "nodebird"
          }
        );
        return res.json({
          code: 200,
          message: "토큰이 발급되었습니다.",
          token
        });
      } catch (err) {
        console.error(err);
        return res.status(500).json({
          code: 500,
          message: "서버 에러"
        });
      }
    });

    // 토큰 발급 테스트
    router.get("/test", verifyToken, (req, res) => {
      res.json(req.decoded);
    });

    module.exports = router;
    ```

    - 버전 1이라는 뜻의 v1.js
    - 한 번 버전이 정해지면 다른 사람이 기존 API를 쓰고 있기 때문에 라우터를 함부로 수정하면 안된다.
    - 즉, 수정사항이 생기면 버전을 올려야 한다.
    - POST /token에서 JWT 토큰 발급
    - 먼저 도메인 검사 후 등록된 도메인이면 jwt.sign 메서드로 JWT 토큰 발급
    - 첫 번재 인수로 페이로드를 넣고, 두 번째 인수는 JWT 비밀키, 세번째 인수로 토큰 옵션(expiresln은 만료 시간, issuer는 발급자)
    - expireln은 1m(1분), 60\*1000 같은 밀리초 단위도 가능
    - GET /test 라우터에서 토큰 인증 테스트 가능
    - 라우터의 응답은 일정한 형식으로 해야 사용자들이 헷갈리지 않음

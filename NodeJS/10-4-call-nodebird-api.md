# NodeBird API 호출

### NodeBird 데이터 제공하기

- nodebird-api의 라우터 작성

  - GET /posts/my, GET /posts/hashtag/:title
  - `nodebird-api/routes/v1.js`

    ```jsx
    const express = require("express");
    const jwt = require("jsonwebtoken");
    const { verifyToken } = require("./middlewares");
    const { Domain, User, Post, Hashtag } = require("../models");

    const router = express.Router();

    // 토큰 발급..
    // 토큰 발급 테스트..

    // 내가 쓴 게시글 가져오기
    router.get("/posts/my", verifyToken, (req, res) => {
      Post.findAll({ where: { userId: req.decoded.id } })
        .then((posts) => {
          res.json({
            code: 200,
            payload: posts
          });
        })
        .catch((err) => {
          console.error(err);
          return res.status(500).json({
            code: 500,
            message: "서버 에러"
          });
        });
    });

    // 해시태그로 검색하는 라우터
    router.get("/posts/hashtag/:title", verifyToken, async (req, res) => {
      try {
        const hashtag = await Hashtag.findOne({
          where: {
            title: req.params.title
          }
        });
        if (!hashtag) {
          return res.status(404).json({
            code: 404,
            message: "검색 결과가 없습니다"
          });
        }
        const posts = await hashtag.getPosts();
        return res.json({
          code: 200,
          payload: posts
        });
      } catch (err) {
        console.error(err);
        return res.status(500).json({
          code: 500,
          message: "서버 에러"
        });
      }
    });

    module.exports = router;
    ```

### Nodebird 데이터 가져오기

- nodecat 라우터 작성

  - 토큰을 발급받고 요청을 보내는 부분을 request 함수로 만들어 둠
  - 요청은 axios로 보내고 세션 토큰 검사, 재발급까지 같이 수행
  - `nodecat/routes/index.js`

    ```jsx
    const express = require("express");
    const axios = require("axios");

    const router = express.Router();

    const URL = "http://localhost:8002/v1";
    axios.defaults.headers.origin = "http://localhost:4000";

    // request 공통 함수로 분리
    const request = async (req, api) => {
      try {
        // 세션에 토큰이 없으면 토큰 발급 시도 - 초기
        if (!req.session.jwt) {
          const tokenResult = await axios.post(`${URL}/token`, {
            clientSecret: process.env.CLIENT_SECRET
          });
          req.session.jwt = tokenResult.data.token; // 세션에 토큰 저장
        }
        return await axios.get(`${URL}${api}`, {
          headers: { authorization: req.session.jwt }
        });
      } catch (error) {
        console.error(error);
        if (error.response.status === 419) {
          // 토큰 만료 시
          delete req.session.jwt;
          return request(req, api);
        }
        return error.response;
      }
    };

    router.get("/mypost", async (req, res, next) => {
      try {
        const result = await request(req, "/posts/my");
        res.json(result.data);
      } catch (error) {
        console.error(error);
        next(error);
      }
    });

    router.get("/search/:hashtag", async (req, res, next) => {
      try {
        const result = await request(req, `/posts/hashtag/${encodeURIComponent(req.params.hashtag)}`);
        res.json(result.data);
      } catch (error) {
        console.error(error);
        next(error);
      }
    });

    module.exports = router;
    ```

### 실제 요청 보내기

- [localhost:4000/mypost에](http://localhost:4000/mypost에) 접속하면 게시글을 받아옴(NodeBird 서비스에 게시글이 있어야 함)

  - localhost:4000/mypost 접속 시 코드

    ```json
    {
      "code": 200,
      "payload": [
        {
          "id": 1,
          "content": "aa",
          "img": "/img/20191206200129028_541622903115711.gif",
          "createdAt": "2021-06-05T14:25:18.000Z",
          "updatedAt": "2021-06-05T14:25:18.000Z",
          "UserId": 1
        },
        {
          "id": 2,
          "content": "내 책상",
          "img": "/img/KakaoTalk_Photo_2021-03-24-00-22-231622903507571.jpeg",
          "createdAt": "2021-06-05T14:31:54.000Z",
          "updatedAt": "2021-06-05T14:31:54.000Z",
          "UserId": 1
        },
        {
          "id": 3,
          "content": "글씨만 올려볼까",
          "img": "",
          "createdAt": "2021-06-05T14:32:04.000Z",
          "updatedAt": "2021-06-05T14:32:04.000Z",
          "UserId": 1
        },
        {
          "id": 6,
          "content": "#노드 #등록 #테스트\r\n",
          "img": "",
          "createdAt": "2021-06-07T14:36:32.000Z",
          "updatedAt": "2021-06-07T14:36:32.000Z",
          "UserId": 1
        },
        {
          "id": 9,
          "content": "#한번 더 \r\n게시글 넣기",
          "img": "",
          "createdAt": "2021-06-14T13:51:16.000Z",
          "updatedAt": "2021-06-14T13:51:16.000Z",
          "UserId": 1
        }
      ]
    }
    ```

- [localhost:4000/search/노드](http://localhost:4000/search/노드) 라우터에 접속하면 노드 해시태그 검색

  - localhost:4000/search/노드 접속 시 코드

    ```json
    {
      "code": 200,
      "payload": [
        {
          "id": 6,
          "content": "#노드 #등록 #테스트\r\n",
          "img": "",
          "createdAt": "2021-06-07T14:36:32.000Z",
          "updatedAt": "2021-06-07T14:36:32.000Z",
          "UserId": 1,
          "PostHashtag": {
            "createdAt": "2021-06-07T14:36:33.000Z",
            "updatedAt": "2021-06-07T14:36:33.000Z",
            "PostId": 6,
            "HashtagId": 1
          }
        },
        {
          "id": 7,
          "content": "#노드 #뉴비",
          "img": "",
          "createdAt": "2021-06-07T14:38:23.000Z",
          "updatedAt": "2021-06-07T14:38:23.000Z",
          "UserId": 2,
          "PostHashtag": {
            "createdAt": "2021-06-07T14:38:23.000Z",
            "updatedAt": "2021-06-07T14:38:23.000Z",
            "PostId": 7,
            "HashtagId": 1
          }
        },
        {
          "id": 8,
          "content": "안녕하세요 #노드 공부중이에요. #해시태그 #어렵다",
          "img": "/img/KakaoTalk_Photo_2021-03-24-00-22-231623076783788.jpeg",
          "createdAt": "2021-06-07T14:39:57.000Z",
          "updatedAt": "2021-06-07T14:39:57.000Z",
          "UserId": 2,
          "PostHashtag": {
            "createdAt": "2021-06-07T14:39:58.000Z",
            "updatedAt": "2021-06-07T14:39:58.000Z",
            "PostId": 8,
            "HashtagId": 1
          }
        }
      ]
    }
    ```

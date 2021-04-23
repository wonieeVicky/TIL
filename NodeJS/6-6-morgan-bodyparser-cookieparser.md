# morgan, bodyParser, cookieParser

http를 이용할 때에는 미들웨어에 직접 라우터 내에서 로직 처리를 하는데 있어서 직접 코드를 적어주어야 하므로 번거로운 부분이 많았다. express에는 이미 만들어진 좋은 미들웨어들이 많은데 이 중 몇가지를 살펴본다. 특히 morgan, bodyParser, cookieParser 등은 Express 라우터에서 항상 함께 사용되는 미들웨어이니 참고하자!

```bash
$ npm i morgan cookie-parser express-session
```

(body-parser는 요즘 잘 안쓴다.)

### morgan

morgan은 요청과 응답을 기록하는 라우터이다.

`app.js`

```jsx
const morgan = require("morgan");

app.use(morgan("dev"));
app.use(morgan("combined")); // production 환경에서 사용
// codes..
```

위와 같이 morgan으로 dev를 감싸주면 브라우저에서 요청보내는 것들을 모두 로깅한다.

```bash
[nodemon] 2.0.7
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node app.js`
3000 번 포트에서 대기 중
GET / 304 6.239 ms - -
GET /favicon.ico 404 2.547 ms - 9
GET / 304 5.021 ms - -
GET /abcda 404 0.512 ms - 9
```

production 환경에서는 combined로 설정해주는데 이러면 더 자세한 로깅이 가능하다.

```bash
[nodemon] restarting due to changes...
[nodemon] starting `node app.js`
3000 번 포트에서 대기 중
::1 - - [23/Apr/2021:10:35:57 +0000] "GET /abcda HTTP/1.1" 404 9 "-" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.85 Safari/537.36"
::1 - - [23/Apr/2021:10:36:05 +0000] "GET / HTTP/1.1" 304 - "-" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.85 Safari/537.36"
```

위와 같이 200, 304, 404 등의 정보에 대한 요청, 응답 시간까지 알려주는 기능을 함.

### cookie-parser

cookie-parser를 이용하면 쿠키 관련 조작들이 편리해진다. 기존에 cookie 정보에서 decodeURLComponent하여 Set-cookie로 데이터를 직접 넣어주는 것보다 훨씬 간편하게 처리할 수 있다.

`app.js`

```jsx
app.get("/", (req, res, next) => {
  // Get cookie
  req.cookies; // { mycookie: 'vicky'}

  // Set cookie
  res.cookie("name", encodeURIComponent(name), {
    expires: new Date(),
    httpOnly: true,
    path: "/",
  });

  // Delete cookie
  res.clearCookie("name", encodeURIComponent(name), {
    httpOnly: true,
    path: "/",
  });
  res.sendFile(path.join(__dirname, "index.html"));
});
```

추가적으로 서명된(암호화에 가까운) 쿠키를 사용할 수도 있다.

```jsx
app.use(cookieParser('vickyPassword');

app.get("/", (req, res, next) => {
  req.signedCookies;  // 쿠키를 서명화할 수 있다.
});
```

### body-parser

기존에 body-parser는 별도의 패키지로 존재했으나 지금은 Express에 추가되었다.

```jsx
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // true면 qs, false면 querystring
// app.use(bodyParser.raw()); // binary data, 안쓰는 듯
// app.use(bodyParser.text()); // 문자열, 안쓰는 듯

app.get("/", (req, res, next) => {
  req.body.name; // 상단 express.json() 처리를 통해 body 파싱이 완료되어 바로 사용 가능
});
```

`express.json()`, `express.urlencoded({})` 등을 통해 body 파싱을 완료시켜 라우터 내에서 편히게 req.body 안의 객체로 접근할 수 있다. `express.json()`는 클라이언트에서 `jsonData`를 보냈을 때 해당 데이터를 파싱해서 보내주는 것이고, `express.urlencoded({})`는 클라이언트에서 `formSubmit`할 때 form을 파싱해주는 역할을 담당한다. (단 formSubmit 시 이미지 데이터를 보낼 경우 urlencoded가 처리하지 못해서 이때에는 multer같은 외부 라이브러리를 추가로 사용해서 처리한다)

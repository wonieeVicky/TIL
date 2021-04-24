# static middleware

static 미들웨어는 기존 http에서 fs로 readFile메서드를 간단히 구현해준다.

```jsx
// 기존 HTTP에서는 아래와 같이 처리했었다.
try {
  const data = await fs.readFile(`.${req.url}`);
  return res.end(data);
} catch (err) {
  // 404 Not Found error
}
```

사용은 `express.static(path.join(__dirname, 'public')))` 포맷으로 한다.

`app.js`

```jsx
// app.use('요청경로', express.static('실제경로'));
// 만약 클라이언트에서 localhost:3000/vicky.html로 요청했을 경우
// react-typescript/public/vicky.html 실제경로로 파일을 찾는다.
app.use("/", express.static(path.join(__dirname, "public")));
```

### static 미들웨어는 순서가 중요하다.

```jsx
app.set("port", process.env.PORT || 3000);

app.use(morgan("dev"));
// 1. cookieParser, json(), urlencoded() 상단에 위치한 express.static
// 면 실행이 안되므로 리소스 누수가 방지할 수 있다.
app.use("/", express.static(path.join(__dirname, "public")));
app.use(cookieParser("vickyPassword"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session());
app.use(multer().array());
```

1. `static` 미들웨어는 정해진 위치가 있진 않지만 순서에 따라 성능 누수가 일어날 가능성이 있다. 기본적으로 express.static 미들웨어는 지정한 파일을 찾으면 Next를 호출하지 않기 때문이다.

   만약 `cookieParser`, `json()`, `urlencoded()` 혹은 `session()`, `multer()` 등의 뒤에 static 미들웨어가 존재하면 해당 위 미들웨어를 불필요하게 모두 실행한 후 `static` 미들웨어가 실행되기 때문임.

### 물론 위치가 정해져 있는 것은 아니다.

```jsx
app.set("port", process.env.PORT || 3000);

app.use(morgan("dev"));
app.use(cookieParser("vickyPassword"));
app.use(session());

app.use("/", express.static(path.join(__dirname, "public")));
// 생략 ..
```

만약 로그인한 고객에게만 어떤 파일을 내려주려고 한다면 `cookieParser`와 `session` 아래에 static를 놓는 것이 맞다. 때문에 위치가 정해져있는 것은 아니고 상황에 따라 적절한 위치에 코드를 위치시키는 것이 중요하다.

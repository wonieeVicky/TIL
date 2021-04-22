# 미들웨어 특성

### 미들웨어

익스프레스는 미들웨어로 구성된다.

- 요청과 응답의 중간에 위치하여 미들웨어라고 불린다.
- app.use(미들웨어)로 장착
  - `(req, res, next) ⇒ {})` 함수 부분이 미들웨어
  - 미들웨어 함수를 각 app.use나 app.post, app.get, app.delete에 장착하여 사용한다.
- 위에서 아래로 순서대로 실행된다.
- 미들웨어는 req, res, next가 매개변수인 함수
- req: 요청, res: 응답 조작 가능
- next()로 다음 미들웨어로 넘어간다.

[미들웨어가 실행되는 경우](https://www.notion.so/9e0877c1f2574dd3a011dcc089ce5262)

```jsx
// 미들웨어는 여러 개 붙여 사용할 수도 있다.
app.use(
  "/vicky",
  (req, res, next) => {
    console.log("실행1");
    next();
  },
  (req, res, next) => {
    console.log("실행2");
    next();
  },
  (req, res, next) => {
    console.log("실행3");
    next();
  }
);
```

`localhost:3000/vicky`

```bash
$ nodemon app

[nodemon] starting `node app.js`
3000 번 포트에서 대기 중
실행1
실행2
실행3
```

### 에러 처리 미들웨어

- 에러가 발생하면 에러 처리 미들웨어로
  - err, req, rs, next까지 매개변수가 4개
  - 첫 번째 err에는 에러에 관한 정보가 담긴다.
  - res.status 메서드로 HTTP 상태 코드를 지정 가능(기본값 200)
  - 에러 처리 미들웨어를 안 연결해도 익스프레스가 에러를 알아서 처리해주긴 한다.
  - 특별한 경우가 아니면 가장 아래 위치하도록 한다.
- 404 처리 시에는 모든 라우터 최하단에서 에러 미들웨어 바로 위에 위치시켜주며,  
  500 에러는 반드시 라우터 최하단에 4개의 인자를 모두 작성한 상태로 처리해 줘야 한다.

      ```jsx
      // 404 middleware
      app.use((req, res, next) => {
        res.status(404).send("404지롱");
      });

      // Error middleware (에러는 인자 4개를 반드시 다 적어야한다.)
      app.use((err, req, res, next) => {
        console.error(err);
        res.status(500).send("에러났어요!");
      });
      ```

      에러 미들웨어에 매개변수 4개를 반드시 적어야하는 이유는 자바스크립트가 매개변수의 개수가 다르면 다른 함수로 생각하기 때문이다.

      ```jsx
      var a = (a,b,c,d) => {} // a.length = 4;
      var b = (a,b,c) => {} // b.length = 3;
      ```

      status는 200이 기본 설정이며 응답 내용에 따라 404, 500 등으로 처리하되 보안에 위협이 되지 않도록 너무 세세한 응답코드를 내려주지 않도록 한다.

### 기타 미들웨어의 특성

- req , res, next를 매개변수로 가지는 함수
- 익스프레스 미들웨어 들도 다음과 같이 축약 가능

  - 순서가 중요하다.
  - static 미들웨어에서 파일을 찾으면 next를 호출 안하므로 json, urlencoded, cookieParser는 실행되지 않는다.

  ```jsx
  app.use(
  	morgan('dev'),
  	express.static('/', path.join(__dirname, 'public'),
  	express.json(),
  	express.urlencoded({ extended: false }),
  	cookieParser(process.env.COOKIE_SECRET),
  );
  ```

- 미들웨어 안에는 하나의 응답코드만 작성해야 하며, 응답코드 전송 후 setHeader 시에는 에러가 발생한다. `Cannot set headers after they are sent to the client`라는 에러 대방출

  ```jsx
  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
    res.send("hello?");
    res.setHeader("Content-Type", "text/html"); // 응답 보낸 뒤에 setHeader..
  });
  ```

- `res.send()` 후에 적힌 코드들도 모두 실행된다. res.json은 정보에 대한 응답을 보낼 뿐 함수를 종료하지 않기 때문임(javaScript 함수 종료는 return으로 하니까..) 이와 별개로 `res.send` 메서드는 기존 `http`의 res.writeHead, res.end 코드를 한 줄로 줄여줘서 매우 편리하다!

  ```tsx
  app.get("/", (req, res) => {
    // res.writeHead(200, { "Content-Type": "application/json" });
    // res.end(JSON.stringify({ hello: "vicky" }));

    res.json({ hello: "vicky" }); // Express가 한 줄로 줄여준다.
    console.log("hello vicky"); // hello vicky
  });
  ```

  res.json()을 많이 사용한다면 api Server, res.sendFile()을 많이 사용한다면 web Server라고 볼 수 있음

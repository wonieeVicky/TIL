# 미들웨어 특성

앞서 `app.use` 메서드를 통해 적용해 보았던 `(req, res, next) ⇒ {})` 함수 부분이 미들웨어라는 것을 다시 한번 복기하자. 해당 미들웨어 함수를 각 app.use나 app.post, app.get, app.delete에 장착하여 사용한다.

1. 미들웨어는 여러 개 붙여 사용할 수도 있다.

   ```jsx
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

2. 미들웨어 안에는 하나의 응답코드만 작성해야 하며, 응답코드 전송 후 setHeader 시에도 에러가 발생한다. 아니면 `Cannot set headers after they are sent to the client`라는 에러 대방출

   ```jsx
   app.get("/", (req, res) => {
     res.sendFile(path.join(__dirname, "index.html"));
     res.send("hello?");
     res.setHeader("Content-Type", "text/html"); // 응답 보낸 뒤에 setHeader..
   });
   ```

3. 404 처리 시에는 모든 라우터 최하단에서 에러 미들웨어 바로 위에 위치시켜주며, 500 에러는 반드시 라우터 최하단에 4개의 인자를 모두 작성한 상태로 처리해 줘야 한다.

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
   var a = (a, b, c, d) => {}; // a.length = 4;
   var b = (a, b, c) => {}; // b.length = 3;
   ```

   status는 200이 기본 설정이며 응답 내용에 따라 404, 500 등으로 처리하되 보안에 위협이 되지 않도록 너무 세세한 응답코드를 내려주지 않도록 한다.

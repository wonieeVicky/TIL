# next 활용법

### next를 호출해야 다음 코드로 넘어간다.

```jsx
app.use(
  (req, res, next) => {
    console.log("언제나 실행하는 코드");
    next();
  },
  (req, res, next) => {
    try {
      throw new Error("에러!");
    } catch (err) {}
  }
);
```

- next를 주석처리하면 응답이 전송되지 않음.
- 다음 미들웨어(라우터 미들웨어)로 넘어가지 않기 때문
- next에 인수로 값을 넣으면 에러 헨들러로 넘어간다.

  ```jsx
  app.get(
    "/",
    (req, res, next) => {
      res.sendFile(path.join(__dirname, "index.html"));
      if (true) {
        next("route"); // !!가 실행된다.
      } else {
        next(); // ??가 실행된다.
      }
    },
    (req, res) => {
      console.log("??");
    }
  );

  app.get("/", (req, res, next) => {
    console.log("!!");
  });
  ```

  - route인 경우 다음 라우터로 넘어간다. 데이터에 따라 다른 라우터로 분기처리해줄 수 있음

  ```jsx
  next(); // 다음 미들웨어로
  next("route"); // 다음 라우터로
  next(error); // 에러 핸들러로
  ```

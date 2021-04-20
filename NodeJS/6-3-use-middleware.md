# 미들웨어 사용 및 라우트 매개변수

express로 라우팅 처리를 할 때 모든 express 설정에 들어가는 아래와 같은 코드가 있을 경우, 각 라우팅 코드 안에 중복 코드를 넣는 것은 매우 비효율적이다.

```jsx
const express = require("express");
const path = require("path");
const app = express();

app.set("port", process.env.PORT || 3000);

app.get("/", (req, res) => {
  console.log("모든 요청에 실행하고 싶다!"); // 중복
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/", (req, res) => {
  console.log("모든 요청에 실행하고 싶다!"); // 중복
  res.send("hello express!");
});

app.get("/about", (req, res) => {
  console.log("모든 요청에 실행하고 싶다!"); // 중복
  res.send("about Express!");
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기 중");
});
```

따라서 위 중복 코드를 미들웨어 `app.use` 메서드를 통해 하나로 통합할 수 있다.

```jsx
const express = require("express");
const path = require("path");
const app = express();

app.set("port", process.env.PORT || 3000);

// 1. app.use를 통한 전 라우터 코드 실행 처리
app.use((req, res, next) => {
  console.log("모든 요청에 실행하고 싶다!");
  next(); // 반드시 next를 넣어준다.
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// 2. 라우터 매개변수를 이용한 라우터
app.get("/category/:name", (req, res) => {
  res.send(`hello ${req.params.name}`);
});

// 3. 정적 라우트 코드가 아래에 있으면 안된다.
app.get("/category/javascript", (req, res) => {
  res.send(`hello Test!`);
});

app.get("/", (req, res) => {
  res.send("hello express!");
});

app.get("/about", (req, res) => {
  res.send("about Express!");
});

// 4. 특히 모든 요청에 처리해야하는 라우터(*)의 경우 최하단에 위치시켜줘야한다.
app.get("*", (req, res) => {
  res.send("about global!");
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기 중");
});
```

1. `app.use`에 공통 처리해야할 코드를 넣고 반드시 3번째 인자인 next를 실행하여 다음 라우터가 실행될 수 있도록 해준다.
2. `:name` 은 라우트 매개변수로, 와일드 카드라고도 잘 불린다. 들어가야 할 path를 고정하기가 어려울 때, 동적 라우팅 처리를 위해 사용한다.
3. 만약`/category/javascript`로 진입했을 때 위에서부터 아래로 코드가 읽히므로 위, 2번 와일드 카드가 매개변수로 들어간 라우터가 동작한다. 아래 정적 라우팅 코드까지 내려가지지 않음. 따라서 와일드 카드는 다른 라우터보다 최대한 아래에 위치해야 오류가 없다.
4. 라우트 내 path에 *이 들어갈 때도 마찬가지이다. *을 기입할 경우 모든 요청에 대한 처리가 들어있는 코드이므로 해당 라우트가 다른 라우트보다 위에 있으면 아래 라우트가 정상 실행되지 않음. 따라서 최하단에 위치시켜야 한다.

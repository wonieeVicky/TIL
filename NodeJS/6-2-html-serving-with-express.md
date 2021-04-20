# express로 HTML 서빙하기

express를 사용해 html를 간단하게 서빙할 수도 있다.

`index.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>익스프레스 서버</title>
  </head>
  <body>
    <h1>익스프레스</h1>
    <p>배워봅시다.</p>
  </body>
</html>
```

`app.js`

```jsx
const express = require("express");
const path = require("path");
const app = express();

app.set("port", process.env.PORT || 3000);

// html 서빙 시에는 sendFile 메서드를 사용한다.
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기 중");
});
```

위와 같이 설정 후 nodemon app 실행시키면, index.html이 잘 출력되는 것을 확인할 수 있음.

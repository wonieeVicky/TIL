## Node, Express 타입

### @types/node

Node 서버 코드에 대한 타이핑을 추가적으로 배워본다. node의 경우 node 모듈들에 대한 타이핑을 하는 개념
먼저 node 모듈들에 대한 타입을 설치해야 한다.

```bash
> npm i -D @types/node
```

`node.ts`

```tsx
import fs = require("fs");
import http = require("http");
import path = require("path");

http
  .createServer((req, res) => {
    // brower는 number로 리턴, node는 NodeJS.Timeout 리턴
    const id = setTimeout(() => {
      console.log("hello");
    }, 1000);
    // ..
  })
  .listen(8080, () => {
    console.log("server started");
  });
```

위와 같은 구조에서 node 파일의 경우 setTimeout이 `NodeJS.Timeout`으로 반환 값이 추론된다.
즉 브라우저에서의 setTimeout과 노드 안에서의 setTimeout은 조금 다른 개념..

다음으로 path모듈을 타입으로 찾아가보면 아래와 같은 구조로 되어있다.

`@types/node/path.d.ts`

```tsx
declare module "path" {
  namespace path {
    // ..
  }
}
```

위와 같이 타입 선언만 있고 구현이 없는 것을 앰비언트라고 한다. 즉, `declare module …` 이걸 앰비언트(ambient) 모듈이라고 할 수 있다. 모듈 타이핑을 해주는 방식으로 이해. 이 구조는 fs도 마찬가지이다.

`@types/node/fs.d.ts`

```tsx
declare module "fs" {
  import * as stream from "node:events";
  // ..
}
// ..
declare module "node:fs" {
  export * from "fs";
}
```

해당 방식은 `@types/node`에서 node에 대한 모듈을 모두 구현하므로, 이런 모듈 단위의 타이핑이 들어간 것이라고 이해하면 된다.

또한 마지막에 node:fs라는 모듈정의가 fs를 모두 포함하도록 처리되고 있는데, 이는 즉 node 모듈 import 시 아래와 같은 방식을 지원함을 의미한다.

```tsx
import fs = require("node:fs");
import http = require("node:http");
import path = require("node:path");
```

실제 node에서는 위 방식을 더 추천함.
위와 같이 처리 후 이제 http, fs, path 모듈 타입 분석을 하나씩 해나가면 된다.
우선 서버 시작을 위해 위와 같이 코드 작성 후 `npx ts-node node.ts` 로 아래 파일을 실행시켜 준다.

`node.ts`

```tsx
import fs from "fs";
import http from "http";
import path from "path";

http
  .createServer((req, res) => {
    fs.readFile(path.join(__dirname, "index.html"), (err, data) => {
      res.writeHead(200);
      res.end(data);
    });
  })
  .listen(8080, () => {
    console.log("server started");
  });
```

`index.html`

```tsx
<html>
	<head>
	  <meta charset="UTF-8">
	  <title>Vicky TS 연습</title>
	</head>

	<body>
	  <div>TS 연습해봅시다.</div>
	</body>
</html>
```

위에서 `http.createServer`, `fs.readFile`. `path.join` 등에 대한 메서드의 타입을 모두 확인할 수 있으며, 필요에 따라 내부에 어떤 타입이 적용되는지 확인해보면 좋겠다.

### @types/express

node는 위처럼 하나씩 메서드를 열어보면서 타입을 확인해보면 된다. 중점적으로 볼 것은 express이다.

```bash
> npm i express
> npm i -D @types/express
```

`express.ts`

```tsx
import express from "express";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", express.static("./public"));

app.get("/", (req, res) => {});

app.listen(8080, () => {});
```

위 구조의 express 기본 코드에서 express는 함수인데 타입스크립트? 라고 생각하면 안됨.
아마도 구조는 아래와 같은 꼴일 것이다.

```tsx
// 예시용. 샘플 코드
interface ExpressFunction {
	(): App;
}

interface Express extends ExpressFunction {
	json: () => Middleware;
	urlEncoded: ({ extended?: boolean }) => Middleware;
	static: (path: string) => Middleware;
}
```

실제 `express/index.d.ts`는 아래와 같다.

```tsx
import * as bodyParser from "body-parser";
import * as serveStatic from "serve-static";
import * as core from "express-serve-static-core"; // 핵심 로직이 몰려있다.
import * as qs from "qs";

declare function e(): core.Express;

// ..
export = e;
```

위 export 구조를 통해 모듈 형태로 타입이 정의되었다는 것을 알 수 있음 (import e from “express”; 도 가능)

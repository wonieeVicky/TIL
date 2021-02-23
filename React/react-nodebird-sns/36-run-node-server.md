# 노드로 서버 구동하기

지금까지 prepare/front 폴더에서 next를 이용해 프론트 화면을 구성했다. 이제 노드로 서버를 구동해보자!

## 노드는

Node.js is a Javascript runtime built on Chrome's V8 JavaScript engine.

- 노드는 서버가 아니며 크롬 v8엔진을 사용하는 자바스크립트 런타임이다.
  - 런타임이란? 자바스크립트 코드를 실행할 수 있도록 해줌

`/prepare/back` 폴더를 생성 후 그 안에 app.js를 생성하고 아래의 코드를 적어본다.

```jsx
const http = require("http"); // http가 서버의 역할을 해준다.

http.createServer(() => {});
http.listen(3065);
```

위 http가 서버의 역할을 해주고 createServer 메서드를 통해 다양한 서버의 설정을 해나가게 된다.  
자세한 코드를 작성하기 전에 우선 back 폴더가 새로 생겼으니 백엔드 프로젝트를 위해 `npm init`을 해준다.  
이후 기존의 app.js로 돌아가 서버를 구성하면 된다.

## 백엔드 서버의 역할

백엔드 서버의 역할은 front의 saga 이벤트에 있는 API 코드들의 목적지가 된다.
예를 들어 `axios.post("/api/login", data);` 와 같은 곳의 /api/login 같은 것들이 다 백엔드 서버이다.

프론트에서 서버를 구성해도 되지만 **굳이 백엔드로 서버를 나누는 이유**는 대규모 앱이 되었을 때를 대비하기 위해서이다. 만약 프론트와 같은 서버로 관리했을 때, 비대칭적인 요청들이 발생할 경우(프론트 서버 요청 1,000회 → 백엔드 서버 요청 10회와 같은..) 스케일링 작업이 필요하게 되는데(컴퓨터를 n대로 늘려서 부하를 나눠갖는 작업) 해당 스케일업에 백엔드 서버가 불필요하게 포함되기도 한다. 때문에 대규모 앱의 경우 서버를 기능별로 분리하여 갖는 경우가 많다. 그래야 특정 기능의 부하가 발생할 때 해당 기능 부분만 서버를 스케일링 하면 효율적이기 때문이다. 따라서 노드버드 프로젝트도 백엔드와 프론트엔드의 서버를 나눠 갖도록 하여 구축한다!

(실제 작은 컴퓨터 두 대가 큰 컴퓨터 한 대보다 싸다💰)

백엔드 서버의 역할은 백엔드는 api 서버로서 SSR등은 모두 프론트에서 담당하고,
오직 데이터베이스에서 가공 혹은 추출하여 전달하는 역할만 담당한다.

## http 서버 실행

먼저 http 서버를 실행해보자 !

```jsx
const http = require("http"); // http가 서버의 역할을 해준다.

const server = http.createServer((req, res) => {
  console.log(req.url, req.method);
  res.end("Hello node");
});

server.listen(3065, () => {
  console.log("서버 실행 중");
});
```

이후 터미널에서 아래와 같이 app.js를 실행하여 준다.

```bash
$ cd prepare/back
$ node app.js // app.js를 실행한다.
서버 실행 중 // callback으로 넣어둔 콘솔이 실행된다!
```

그러면 브라우저에서 `localhost: 3065` 로 로컬브라우저가 띄워진 것을 확인할 수 있다. 이후 터미널에 아래와 같은 기록들이 담기는데, 이는 모두 브라우저에서 공통으로 실행하는 것이므로 참고만 한다.

```bash
/ GET
/favicon.ico GET
```

app.js의 http.createServer 메서드에는 두 가지 인자가 들어가는데 하나는 Request의 약자인 req, 두 번째는 Response의 약자인 res가 들어간다. 이름에서도 알 수 있듯 req에는 프론트에서 넘어온 요청에 대한 정보가 담기며, res에는 응답에 대한 정보가 담긴다.

```jsx
const http = require("http"); // http가 서버의 역할을 해준다.

const server = http.createServer((req, res) => {
  console.log(req.url, req.method);
  res.write("<h1>hello vicky1</h1>");
  res.write("<h2>hello vicky2</h2>");
  res.write("<h3>hello vicky3</h3>");
  res.write("<h4>hello vicky4</h4>");
  res.end("<h5>Hello node!!</h5>");
});
server.listen(3065, () => {
  console.log("서버 실행 중");
});
```

위와 같이 HTML을 값으로 내려줄 수도 있다!
(소스코드를 변경했을 경우 서버를 껐다가 다시 켜주어야 변경사항이 반영된다! 저절로 업데이트가 안된다.)

node의 기본적인 원리는 node에서 기본으로 제공하는 http 메서드의 createServer를 이용하여 요청 method나 url에 따라서 응답(res.write)해주는 것이라고 할 수 있다. (아래코드 참조)

```jsx
const http = require("http"); // http가 서버의 역할을 해준다.
const { isRegExp } = require("util");

const server = http.createServer((req, res) => {
  if (req.method === "GET") {
    if (req.url === "/api/posts") {
    }
    if (req.url === "/api/posts") {
    }
  } else if (req.method === "POST") {
    if (req.url === "/api/posts") {
    }
    if (req.url === "/api/posts") {
    }
  } else if (req.method === "DELETE") {
    if (req.url === "/api/posts") {
    }
    if (req.url === "/api/posts") {
    }
  }
  res.end("");
});
server.listen(3065, () => {
  console.log("서버 실행 중");
});
```

하지만 node에서 기본으로 제공하는 http로만 서버를 구성하게 될 경우 app.js 에서는 위와 같이 request의 url과 method를 통해 엄청나게 다양한 분기를 나눠 처리해야 하므로 이러한 불편함을 개선하기 위해 `express`라는 프레임워크를 사용한다.

노드의 기본적인 원리를 되새겨보자.
프론트서버가 요청한 것에 대해 한번 요청 시 한번의 응답을 내려주는 것이 기본 동작(1:1 요청 - 응답)이며
응답을 보내지 않을 경우 특정 시간(30초 정도) 후에 브라우저가 자동으로 응답 실패로 처리한다.

만약 요청 시 여러개의 데이터를 필요로 할 경우 어떻게 할까? 방법은 다양하지만 하나의 요청 시 여러 개의 데이터를 전체 다 묶어서 한번에 보내는 방식이나 요청을 여러번 보내, 응답 또한 여러번 나눠 조각별로 내보내는 방식이 있다. 어쨌든 요청과 응답은 1:1 구조를 가져야 한다. (res.end 두 번 사용하면 안됨!)

이제 좀 더 효율적인 코딩이 가능한 express를 설치해보자!

```bash
$ npm i express
```

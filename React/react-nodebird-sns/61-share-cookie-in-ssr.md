# SSR시 쿠키 공유하기

초기 데이터를 가져온 뒤 화면이 렌더링되도록 설정하는 것은 완료되었다. 그런데 다시 로그인을 하려하니 "로그인하지 않은 사용자만 접근 가능합니다"라는 alert가 발생한다. 이미 로그인이 되어있다는 의미이다. 그렇다면 현재 게시글은 정상적으로 서버사이드렌더링이 되는데, 왜 내 정보는 SSR이 구현되지 않을까?

실제 `pages/index.js` 에서 실행되는 getServerSideProps는 브라우저에서 실행되는 것이 아닌 **프론트서버**에서 실행된다. 이는 곧 프론트서버 → 백엔드 서버 사이의 요청에 이전 시간에 개선 경험이 있는 credential이나 access-control-origin 등의 문제가 발생한다는 의미이다. 하지만 이미 app.js에서 해당 cors를 허용하도록 설정해준 상태이다. 그런데 왜 해당 문제가 발생할까?

```jsx
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3026",
  })
);
```

위 설정은 받아주는 쪽에서 열어준 설정이다. 그렇다면 우리는 보내는 쪽(send)의 설정을 들여다봐야한다.

초기 브라우저 → 백엔드로 데이터를 보낼 때 로그인 정보에 대한 쿠키는 브라우저에서 직접 알아서 헤더에 담아 axios 요청을 했었다. 그러나 서버사이드렌더링의 주체는 프론트서버 → 백엔드 서버이므로 프론트 서버가 데이터 요청 시 해당 쿠키값을 담아서 보내주도록 SSR 시 쿠키를 공유해줘야 한다.

먼저 현재 유저정보를 가져오는 GET /user 에서 쿠키의 값은 req.headers에 들어가므로 해당 라우터 안에 콘솔로 req.headers를 확인해보면 쿠키값이 별도로 실려있지 않은 것을 확인할 수 있다.

```bash
{
  accept: 'application/json, text/plain, */*',
  'user-agent': 'axios/0.21.1',
  host: 'localhost:3065',
  connection: 'close'
}
GET /user 200 1.249 ms - 4
```

위와 같이 headers에 쿠키가 실려있지 않으니 백엔드에서는 로그인한 상태를 모른다.  
따라서 headers에 정상적으로 실릴 수 있도록 설정해준다.

`pages/index.js`

```jsx
export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  const cookie = context.req ? context.req.headers.cookie : "";
  axios.defaults.headers.Cookie = cookie;
  // dispatch settings..
});
```

위와 같이 설정 후 다시 화면 새로고침을 해주면 내 정보 영역까지 문제없이 서버사이드렌더링이 되는 것을 확인할 수 있다! 실제 GET /user 의 req.headers에도 쿠키값이 정상적으로 들어오는 것을 확인할 수 있다.

```bash
{
  accept: 'application/json, text/plain, */*',
  cookie: 'connect.sid=s%3Agozn-HwfQJryIlnx-hkwgRRLVTjxzg-4.1kspjX3ifRu3We7t6eA5GDsOafdxN2X1am%2FdZSpR0lI',
  'user-agent': 'axios/0.21.1',
  host: 'localhost:3065',
  connection: 'close'
}
```

그런데 여기에 큰 오류가 있다. 프론트서버에 axios.default.headers.Cookie를 직접 주입하는 방식으로 하면 다른 사람이 브라우저에 진입 시에도 같은 쿠키가 공유되어 같은 유저라고 판단한 백엔드 서버에 의해 내 아이디로 다른 유저가 이용할 수 있다.

그래서 이 문제를 막으려면 index.js의 `getServerSideProps`설정 시 아래 분기를 추가해주어야 한다. 쿠키값을 지웠다가 데이터가 context.req와 cookie가 있을 때만 새롭게 cookie를 적용하고, 또 추가했다가 적용하는 과정을 추가한 것이다. 이렇게 해야 이후의 다른 유저가 왔을 때 쿠키값 공유에 대한 에러가 발생하지 않는다.

`pages/index.js`

```jsx
export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  const cookie = context.req ? context.req.headers.cookie : "";
  axios.defaults.headers.Cookie = "";
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }
  // dispatch settings..
});
```

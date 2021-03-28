# nginx와 콘솔 에러 개선

몇가지 디버그 콘솔에서 보이는 에러를 개선해보자

사이트 진입 시 콘솔에 production임에도 불구하고 Redux-devtool이 그대로 실행되고 있다. (HYDRATE 등의 Redux 구조가 그대로 노출). 이 내부에는 sequelize attribute로 데이터에 비밀번호 정보가 없도록 해줘야겠지만, 사용자 환경에서의 정보 노출도 어느정도 제한을 걸 필요가 있다.

`front/store/configureStore.js`

```jsx
const configureStore = () => {
  // settings..
  const enhancer =
    process.env.NODE_ENV === 'production'
      ? compose(applyMiddleware(sagaMiddleware))
      : composeWithDevTools(applyMiddleware(sagaMiddleware, loggerMiddleware));
  // settings..
};
```

위와 같이 production 환경에서와 development 환경에서 동작하는 미들웨어를 나눠준다. (loggerMiddleware 제외) 그리고 콘솔에 매번 다오는 HYDRATE 콘솔 로그들도 삭제해주기 위해 `reducer/index.js`에서 rootReducer 아래에 case HYDRATE 에 있던 디버그 콘솔도 삭제해준다.

이와 별개로 next/link를 사용하는 곳에서 에러가 발생하고 있다. prefetch가 true(default)로 되어있을 경우 Link를 사용한 페이지 모두 정적 페이지로 만들어 놓으려고 하기 때문이다. 따라서 데이터를 미리 불러오는 과정(prefetch)을 막기 위해 Link태그를 사용하는 곳에 Prefetch 설정을 꺼버리자

`components/PostCard.js` , `components/PostCardContent.js`

```jsx
<Link href={...} prefetch={false}>{/* codes.. */}</Link>
```

프론트 서버를 재시작하면 발생하던 에러가 사라지는 것을 확인할 수 있다 : )

그런데 또 다른 문제가 있다! 바로 새로고침을 하면 로그인이 풀려버리는 이슈이다.
살펴보니 secure가 true인 Cookie가 제대로 들어오지 않는 이슈로 확인, 구글링해서 문제를 해결해주었다.

```bash
$ vim app.js
```

```jsx
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1); // 추가
  // settings...
}
// settings...

app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET,
    proxy: true, // 추가
    cookie: {
      httpOnly: true,
      secure: false,
      domain: process.env.NODE_ENV === 'production' && '.vickydev.com', // api.vickydev.com과 vickydev.com 사이의 쿠키 공유 가능
    },
  })
);
```

```bash
$ vim /etc/nginx/nginx.conf
```

```json
location / {
        proxy_set_header HOST $host;
        proxy_set_header X-Forwarded-Proto $scheme; // 추가
        proxy_pass http://127.0.0.1:3065;
        proxy_redirect off;
}
```

위와 같이 설정 후 nginx를 restart해주면 정상적으로 로그인이 풀리지 않는 것을 확인할 수 있다!

# 백엔드에 https 적용하기

프론트에 https를 적용했으니 백엔드에도 https를 적용해볼 차례이다. 앞서 설정한 프론트 https 설정 방법을 따라하여 nginx와 certbot-auto로 https 인증서를 받고, nginx를 실행시켜보도록 하자

설정이 모두 완료되었다면 사이트를 열어 로그인을 구현해준다! 그러면 당연히 에러가 난다 :)
바로 API 요청 주소에서 https가 아닌 요청이기 때문이다. 따라서 아래 설정을 수정해준다.

`root@ip-111-11-1-11115:/home/ubuntu/react-next-js-nodebird/prepare/front#`

```json
$ vim /config/config.js
```

```jsx
export const backUrl = 'https://api.vickydev.com'; // http -> https
```

그리고 다시 재빌드 후 서버를 시작하면 또 에러 발생 😇
이번엔 CORS 에러이다. CORS 에러의 경우 백엔드 서버의 app.js 문제이니 여기서 설정을 수정해준다!

`root@ip-111-11-1-11115:/home/ubuntu/react-next-js-nodebird/prepare/back#`

```bash
$ vim app.js
```

```jsx
if (process.env.NODE_ENV === 'production') {
  // cors 설정
  app.use(
    cors({
      origin: ['https://vickydev.com'], // http -> https
      credentials: true,
    })
  );
}
// settings..
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: true, // false -> true!
      domain: process.env.NODE_ENV === 'production' && '.vickydev.com', // api.vickydev.com과 vickydev.com 사이의 쿠키 공유 가능
    },
  })
);
```

이후 `npx pm2 reload all`을 실행하여 백엔드 서버를 재구동시켜주면 로그인이 정상적으로 이루어지는 것을 확인할 수 있다!

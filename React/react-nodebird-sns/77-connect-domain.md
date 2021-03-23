# 도메인 연결

현재 배포한 서버로 회원가입과 로그인이 동작하지만, 문제는 페이지 새로고침 시 로그인이 풀려버리는 현상이 발생한다. CORS는 해결했어도 쿠키 이슈가 있어서 그러하다. (This Set-Cookie was blocked because its Domain attribute was invalid with regards to the current host url) 이는 즉 요청을 보낸 곳과 요청을 받는 곳의 도메인이 달라서 쿠키공유가 안되는 이슈가 있다. 이슈해결을 위해 도메인을 구매 후 프로젝트에 연결해본다!

### 도메인 구매 및 Router53 레코드 세트 등록

먼저 가비아에서 [vickydev.com](http://vickydev.com) 도메인을 구매했다 😇 도메인 구매가 완료되면 AWS → Router53이라는 서비스에 접속해서 [호스팅 영역 생성]버튼을 눌러 vickydev.com 도메인을 등록해준다. 그렇게 한 뒤 호스팅 영역 세부정보로 들어가면 NS, SOA라는 유형 두개의 필드가 vickydev.com에 생성된 것을 볼 수 있는데, 이 중 NS에 있는 값/트래픽 라우팅 대상값 4개를 가비아의 네임서버에 등록해준다.

다음 해당 IP를 연결해주기 위해 EC2에서 탄력적 IP 주소를 2개 할당 받는다! (프론트 1개, 백 1개)
경로: [EC2] → [탄력적 IP] → [탄력적 IP 주소 할당]

원래 탄력적 IP를 사용하는 것에도 비용이 발생하는데, 인스턴스를 하나씩 연결해놓으면 무료로 쓸 수 있다! (나중에 인스턴스 지우면서 탄력적IP도 같이 삭제해줘야하는 것 잊지말자!)

위와 같이 탄력적 IP를 인스턴스에 연결을 완료하면 이제 퍼블링 IPv4 주소가 고정이 된다.  
다음으로는 다시 Router53 메뉴로 가서 [호스팅 영역] 메뉴로 진입하여 레코드 세트를 생성해준다.

- 프론트용 : [vickydev.com](http://vickydev.com) | 유형: A | front IPv4 주소
- 백용: [api.vickydev.com](http://api.vickydev.com) | 유형: A | back IPv4 주소
- www용: [www.vickydev.com](http://www.vickydev.com) | 유형: CNAME | vickydev.com

위와 같이 프론트 레코드 세트를 3개 생성해준다.

### 서버 내 도메인 반영

이렇게 설정 후 api.vickydev.com에 접속하면 백엔드 서버가 잘 동작하는 것을 확인할 수 있다! 단 아직 프론트 서버는 동작에 에러가 발생한다. 기존 코드에 IPv4 주소가 vickydev.com으로 업데이트되지 않았기 때문이다.

`front/config/config.js`

```jsx
export const backUrl = 'http://api.vickydev.com';
```

`back/app.js`

```jsx
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined')); // combined를 사용하면 더 자세한 로그를 볼 수 있다.
  app.use(hpp()); // 필수
  app.use(helmet()); // 필수
  app.use(
    cors({
      origin: ['http://vickydev.com'], // Access-Control-Allow-Origin: http://vickydev.com
      credentials: true,
    })
  );
} else {
  app.use(morgan('dev'));
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );
}
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
      // api.vickydev.com과 vickydev.com 사이의 쿠키 공유 가능
      // Set-Cookie: connect.sid=...; Domain=.vickydev.com; ...
      domain: process.env.NODE_ENV === 'production' && '.vickydev.com',
    },
  })
);

// settings...
```

위처럼 경로를 수정해준 뒤 front 서버는 `git pull` → `npm run build` → `npx pm2 reload all && npx pm2 monit` back 서버는 `git pull` → `npx pm2 reload all`로 수정사항을 반영해주면 정상적으로 두 도메인 모두 잘 동작하고 새로고침 뒤에도 쿠키가 보존되어 세션이 유지되는 것을 확인할 수 있다 !

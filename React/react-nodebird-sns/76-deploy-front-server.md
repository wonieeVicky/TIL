# 프론트서버 배포하기

이제 프론트 서버를 배포할 차례이다. 배포 전에 해야할 일은 백엔드 서버 주소로 넣어두었던 localhost:3065경로를 AWS에서 보여주는 퍼블릭 IP 주소로 변경해줘야 하는 부분이다.

먼저 바뀌어야할 지점이 많으므로 한 파일에서 해당 IP주소를 관리할 수 있도록 파일을 새로 만든다.

front/config/config.js

```jsx
export const backUrl = 'http://3.35.17.240';
```

위와 같이 export 변수를 생성해준 뒤 기존의 localhost:3065를 바라보고 있던 곳을 모두 backUrl로 변경해준다. (sagas/index.js, PostCard.js 등)

`front/package.json`

```json
{
  "scripts": {
    "dev": "next -p 3026",
    "build": "cross-env ANALYZE=true NODE_ENV=production next build",
    "start": "cross-env NODE_ENV=production next start -p 80"
  }
}
```

이와 더불어 ubuntu front 서버가 실행될 때 80포트로 실행되도록 start scripts를 80으로 변경해준 뒤, 프론트 서버 역시 background process 로 동작시키기 위해 pm2 패키지를 인스톨해준다!

`ubuntu@ip-172-31-4-195:~/react-next-js-nodebird/prepare/front`

```bash
$ git pull
$ npm i
$ npm run build // front는 변경사항 생기면 반드시 빌드 먼저 해주는 거 잊지말자
$ sudo npx pm2 start npm -- start
$ sudo npx pm2 monit
```

위와 같이 설정한 뒤 front 서버의 퍼블릭 IP주소로 진입하면 정상적으로 SSR이 되는 것을 확인할 수 있다. 단 API 동작 시 CORS가 발생하는데, 이는 백엔드 서버의 app.js 내 cors 설정 안에 프론트 서버 주소가 포함되지 않았기 때문으로 ubuntu front 서버 IP를 app.js 의 cors 설정에 추가해준 뒤 ubuntu back 서버에서 반영해준다.

`back/app.js`

```jsx
app.use(
  cors({
    origin: ['http://localhost:3026', 'nodebird.com', 'http://52.79.115.13'],
    credentials: true,
  })
);
```

위와 같이 설정 후 다시 ubuntu/back 서버를 다시 구동해준 뒤 프론트 IP로 브라우저 접속하면 정상적으로 회원가입되는 것을 확인할 수 있다.

- 혹시 API 동작 시 에러가 발생한다면

  `npx pm2 monit`을 통해 ubuntu 환경에서 발생하는 에러 로깅을 보고, 이유를 찾아본다. 먼저 API 동작 시 발견된 문제는 테이블이 발견되지 않는다는 이슈가 발견된 사례가 있어 기록으로 남긴다. 이때는 ubuntu back에서 아래와 같이 이슈를 확인한다.

  `root@ip-172-31-8-91:/home/ubuntu/react-next-js-nodebird/prepare/back`

  ```jsx
  $ mysql -uroot -p
  Enter password:

  $ use react-nodebird;
  $ show tables;

  +--------------------------+
  | Tables_in_react-nodebird |
  +--------------------------+
  | Follow                   |
  | Like                     |
  | PostHashtag              |
  | Comments                 |
  | Hashtags                 |
  | Images                   |
  | Posts                    |
  | Users                    |
  +--------------------------+
  ```

  위 로깅을 보면 몇몇 테이블이 대문자로 생성된 것을 볼 수 있다 ! 이런 과정에서 에러가 발생한 것으로 추측됨.

  ```jsx
  mysql> DROP DATABASE `react-nodebird`;
  Query OK, 8 rows affected (0.13 sec)
  mysql> exit;
  ```

  위와 같이 기존의 react-nodebird 데이터를 삭제해준 뒤 다시 create 한 다음 다시 시작하면 문제없이 서버가 구동된다.

  ```jsx
  $ lsof -i tcp:80
  $ sudo npx pm2 kill // 있으면 80포트 강제 종료
  $ npx sequelize db:create
  $ npm start && npx pm2 monit
  ```

  `npx pm2 reload all` `npx pm2 list`

  ```jsx
  mysql> use react-nodebird
  mysql> show tables;
  +--------------------------+
  | Tables_in_react-nodebird |
  +--------------------------+
  | Follow                   |
  | Like                     |
  | PostHashtag              |
  | comments                 |
  | hashtags                 |
  | images                   |
  | posts                    |
  | users                    |
  +--------------------------+
  ```

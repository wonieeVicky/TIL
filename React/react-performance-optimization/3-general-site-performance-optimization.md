## 일반 홈페이지 최적화

### 이번 시간에는 이런 것을 배운다.

- 로딩 성능 최적화
  - 이미지 레이지(Lazy) 로딩
  - 이미지 사이즈 최적화
  - 동영상 최적화
  - 폰트 최적화
  - 캐시 최적화
  - 불필요한 CSS 제거
- 분석 툴
  - 크롬 Network,Performance, Lighthouse, Coverage 탭

### 코드 분석에 앞서

프로젝트 [링크](https://github.com/performance-lecture/lecture-3)에서 소스를 다운받은 뒤 `npm i`으로 프로젝트를 로컬에 클론해준다.

`package.json`

```json
"scripts": {
  "start": "npm run build:style && react-scripts start",
  "build": "npm run build:style && react-scripts build",
  "build:style": "postcss src/tailwind.css -o src/styles.css",
  "serve": "node ./server/server.js",
  "server": "node ./node_modules/json-server/lib/cli/bin.js --watch ./server/database.json -c ./server/config.json"
},
```

serve, server는 서버 관련한 실행을 의미. build:style은 스타일을 빌드하는 명령어임

```bash
> npm run build
> npm run serve
> npm run server
```

위 명령어들로 홈페이지를 로컬에서 실행시켜 화면을 확인해준다.

## 블로그 사이트 최적화

### 아래의 것을 배운다.

- 로딩 성능 최적화
  - 이미지 사이즈 최적화
  - Code **Split**
  - 텍스트 압축
- 렌더링 성능 최적화
  - Bottleneck 코드 최적화
    - 병목 현상을 일으키는 코드를 찾아낸다!

### 분석 툴 소개

1. 크롬 Network 탭
   1. 네트워크 리소스의 정보를 알려준다.
2. 크롬 Performance 탭
   1. 웹 페이지 동작 시 실행되는 모든 작업을 보여준다.
3. 크롬 Audit 탭(Light house)
   1. 서비스의 성능 수준을 파악할 수 있다.
4. webpack-bundle-analyzer
   1. 웹팩으로 번들링된 파일 크기를 확인할 수 있다.

### 서비스 탐색 및 코드 분석

```bash
.
├── README.md
├── package-lock.json
├── package.json
├── public
│   ├── favicon.ico
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
├── server
│   ├── config.json
│   └── database.json
├── src
│   ├── App.css
│   ├── App.js
│   ├── components
│   │   ├── Article
│   │   │   ├── index.css
│   │   │   └── index.js
│   │   ├── ArticleList
│   │   │   ├── index.css
│   │   │   └── index.js
│   │   ├── Footer
│   │   │   ├── index.css
│   │   │   └── index.js
│   │   ├── Header
│   │   │   ├── index.css
│   │   │   └── index.js
│   │   └── markdowns
│   │       └── CodeBlock.js
│   ├── index.css
│   ├── index.js
│   ├── pages
│   │   ├── ListPage
│   │   │   ├── index.css
│   │   │   └── index.js
│   │   └── ViewPage
│   │       ├── index.css
│   │       └── index.js
│   └── templates
│       └── BasicTemplates.js
└── yarn.lock
```

실제 블로그 사이트 디렉토리 구조는 이러하다.
server 폴더는 데이터를 내려주는 서버역할을 담당하며 src 내부의 소스는 해당 화면을 처리하는 소스들이 담겨져있다.

### Lighthouse 툴을 이용한 페이지 감사

Lighthouse이라는 개발자 도구에 대해 알아보자. 사용법은 매우 간단하다.

![](../../img/220628-1.png)

크롬 개발자 도구의 Lighthouse 탭을 연 뒤 검사할 환경을 설정한다. (우리는 주로 Performance 위주로 검사하므로 Performance 선택) 이후 상단 [Analyze page load] 버튼을 클릭하면 페이지에 대한 성능 검사가 시작된다.

![](../../img/220628-2.png)

버튼을 누르면 위와 같이 현재 페이지에 대한 성능 검사에 대한 결과가 나온다.

- 가장 먼저 보이는 75의 숫자는 전체적인 성능 점수를 나타낸다.
- 페이지가 로드되는 화면을 순차적인 이미지로 보여준다.
- 다음으로 Oppotunities는 리소스적인 즉, 로딩 성능 최적화에 대한 가이드를 제공하고 Diagnostics는 페이지의 실행관점, 즉, 렌더링 성능 최적화와 연관이 있는 가이드를 제공한다.
- Passed Audits은 검사 시 통과한 항목에 대해 확인할 수 있다.

### 이미지 사이즈 최적화

이번에는 opportunities 항목을 자세히 분석해본다.

![](../../img/220629-1.png)

가장 먼저 이미지 사이즈 최적화 이슈를 확인할 수 있다. (Properly size images)
우측 토글 버튼을 누르면 최적화가 필요한 이미지가 리스트로 노출된다.

![](../../img/220629-2.png)

문제가 되는 이미지는 블로그 우측의 tiny image이다. 실제 해당 이미지 사이즈를 확인해보면 아래와 같다.

![](../../img/220629-3.png)

실제 다운로드된 이미지는 1200\*1200px의 고해상도 이미지이지만, 실제 노출되는 이미지 사이즈는 120\*120px이다. 실제 필요한 사이즈보다 100배 가량 큰 이미지인 것이다. 그렇다면 120\*120px이미지로 불러와야할까? 노노.. 요즘 레티나 디스플레이 등의 성능 강화로 인해 보통 2배 크기로 불러오는 것이 좋다. (240\*240px)

그런데 api로 받아오는 이미지를 어떻게 축소하여 최적화할 수 있을까?
먼저, image CDN을 이용해서 최적화할 수 있다.

> ⚠️ CDN(Contents Delivery Network)이란?
> 물리적 거리의 한계를 극복하기 위해 소비자(사용자)와 가까운 곳에 컨텐츠 서버를 두는 기술

image processing CDN은 기본 CDN 개념과는 살짝 다르다. 이미지를 사용자에게 보내기 전에 전처리 과정을 통해 가공하여 송출하는 방식을 의미한다. 아래와 같은 포맷으로 사용한다.

```
http://cdn.image.com?src=[img src]&width=200&height=100
```

실제 브런치 사이트의 경우도 image CDN을 사용하고 있는데, 포맷을 보면 아래와 같다.

```
https://img1.daumcdn.net/thumb/C240x0.fjpg/?fname=http://t1.daumcdn.net/brunch/service/user/eaka/image/OqblFWlX82j2Fraw-oNPi-Nbyro
```

위 포맷은 큰 이미지를 가로 240px에 맞춰 가공하여 내보내주도록 처리해주는 것을 확인할 수 있다.
실제 서비스에서는 직접 이미지 cdn을 구축하여 사용하지만 간단하게 img CDN 솔루션(imgix 등)을 사용하여 편하게 사용할 수 있다.

위 솔루션 사용은 실무에서 직접 적용해보는 것으로 하고, 실제 코드에서 어떻게 줄이는지 확인해보자.
해당 이미지 영역을 노출하는 코드를 보면 아래와 같다.

`index.js`

```jsx
/* 파라미터 참고: https://unsplash.com/documentation#supported-parameters */
function getParametersForUnsplash({ width, height, quality, format }) {
  return `?w=${width}&h=${height}&q=${quality}&fm=${format}&fit=crop`;
}

function Article(props) {
  const createdTime = new Date(props.createdTime);
  return (
    <div className={"Article"}>
      {/* codes.. */}
      <div className={"Article__thumbnail"}>
        {/* <img
          src={props.image + getParametersForUnsplash({width: 1200, height: 1200, quality: 80, format: 'jpg'})}
          alt='**thumbnail**'
        /> */}
        <img
          src={props.image + getParametersForUnsplash({ width: 240, height: 240, quality: 60, format: "jpg" })}
          alt="thumbnail"
        />
      </div>
    </div>
  );
}

export default Article;
```

이미지 경로를 넣는 영역에 `getParametersForUnsplash({width: 1200, height: 1200, quality: 80, format: 'jpg'})` 를 보면 실제 호출하는 이미지 크기를 설정하는 부분이 있는 것을 확인할 수 있음. `getParametersForUnsplash` 함수가 이미지 cdn 역할을 담당한다.

해당 설정을 240\*240px로 줄이면 아래와 같이 이미지가 조정되어 들어오는 것을 확인할 수 있다.

![](../../img/220629-4.png)

위와 같이 개선 후 lighthouse를 재 실행하면 기존의 이미지 성능 저하 경고가 사라진 것을 확인할 수 있다.

![](../../img/220629-5.png)

### bottleneck 코드 탐색

다음에 보이는 Minify JavaScript 는 번들링 작업 중 code compress 작업을 통해 minify나 drop console 작업을 수행할 수 있다. 해당 방법으로 개선하면 됨. 이 밖의 다양한 개선점을 opportunities와 diagnostics에서 확인할 수 있는데, 문제는 정확히 어떤 스크립트 코드에서 성능을 저하시키는지 알 수 없다는 것이다.

이 떄 우리는 Performance 탭을 이용한다. Performance에 retry 버튼을 누르면 페이지 로드 시 발생하는 다양한 과정을 프레임 차트로 보여준다.

![](../../img/220701-1.png)

브라우저가 로드되는 과정을 자세하게 나눠놓은 해당 프레임 그래프를 확대해보면서 성능 저하를 일으키는 원인을 발견할 수 있다.

![](../../img/220701-2.png)

아래 이미지를 보면 페이지 로드 후 Article 컴포넌트에서 removeSpecialCharacter가 여러번 실행되는 것을 확인할 수 있다. 해당 이벤트는 한번 발생하는 이벤트이지만 사용하는 자원이 많아 중간중간 GC가 자원을 정리해주는 것을 확인할 수 있다.

### bottleneck 코드 최적화

이제 성능 저하를 일으키는 `Article` 컴포넌트를 뜯어볼 차례이다.

`src/components/Article/index.js`

```jsx
/*
 * 파라미터로 넘어온 문자열에서 일부 특수문자를 제거하는 함수
 * (Markdown으로 된 문자열의 특수문자를 제거하기 위함)
 * */
function removeSpecialCharacter(str) {
  const removeCharacters = ["#", "_", "*", "~", "&", ";", "!", "[", "]", "`", ">", "\n", "=", "-"];
  let _str = str;
  let i = 0,
    j = 0;

  for (i = 0; i < removeCharacters.length; i++) {
    j = 0;
    while (j < _str.length) {
      if (_str[j] === removeCharacters[i]) {
        _str = _str.substring(0, j).concat(_str.substring(j + 1));
        continue;
      }
      j++;
    }
  }

  return _str;
}
```

Article이라는 컴포넌트에서 성능 누수를 발생시키는 removeSpecialCharacter 코드는 위와 같다. 특정 특수문자가 있는지 전체 판별하여 제거해주는 removeSpecialCharacter 함수는 for문과 while 문을 중첩하여 사용하기 때문에 누수가 발생된다. 우리는 이를 1. 특수문자를 효율적으로 제거하는 것과 2. 작업하는 양을 줄이는 방법을 사용해서 bottleneck 코드를 개선할 수 있다.

1. 특수문자를 효율적으로 제거하기
   1. Replace 함수와 정규식을 사용 ✅
   2. 마크다운의 특수문자를 지워주는 라이브러리를 사용
      1. remove-markdown 등..
2. 작업하는 양 줄이기
   1. 가져오는 데이터 양 자체를 줄이는 방법! (최장 90021자에 달하는 컨텐츠를 모두 담아오지 않도록 한다.)

위 처리사항에 맞춰 아래와 같이 removeSpecialCharacter 함수를 수정해준다.

```jsx
/*
 * 파라미터로 넘어온 문자열에서 일부 특수문자를 제거하는 함수
 * (Markdown으로 된 문자열의 특수문자를 제거하기 위함)
 * */
function removeSpecialCharacter(str) {
  let _str = str.substring(0, 300);
  _str = _str.replace(/[\#\_\*\~\&\;\!\[\]\`\>\\n\=\-]/g, "");

  return _str;
}
```

이후 Performace 탭을 재실행시키면, 기존에 removeSpecialCharacter에서 발생하던 성능 누수 이슈가 사라진 것을 확인할 수 있다.

![](../../img/220703-1.png)

### bundle 파일 분석(bundle-analyzer)

이번시간에는 bundle 파일을 분석해본 뒤 파일을 적절히 분할해보도록 한다.
Performance 탭에 보면 .chunk.js 파일의 용량으로 인해 파일 로드 시간이 오래걸리는 것을 확인할 수 있다.

![](../../img/220704-1.png)

그러면 우린 이 파일을 어떻게 최적화하고 로드를 단축할 수 있을까? 그러기 위해서는 우린 해당 파일에 어떤 내용이 저장되는지 알아야한다. 이때 우리는 `webpack-bundle-analyzer`를 통해 번들링된 파일들이 어떻게 구성되어있는지를 확인할 수 있다.

그런데 해당 패키지를 사용하려면 직접 웹팩을 구성해야하는데, 우리는 cli의 기본 웹팩을 사용하고 있으므로 cli를 eject 하거나 별도의 패키지를 깔아야 한다. 다행히 `cli-bundle-analyzer`를 통해 별도로 커스텀하지 않아도 특정 패키지를 추가할 수 있게 되었다!

`cra-bundle-analyzer`에서 나온대로 패키지를 설치해본다.

```bash
> npm install --save-dev cra-bundle-analyzer
> npx cra-bundle-analyzer
```

위와 같이 프로젝트에서 실행해주면 해당 프로젝트에서 bundle-analyzer가 실행되어 분석한 결과가 페이지로 펼차진다!

![](../../img/220704-2.png)

해당파일을 보면 가장 크게 2.6140cefb.chunk.js 파일이 있다는 것 확인 가능. 우측 파란색은 해당 파일에 속하는 컴포넌트가 어떤 것인지를 보여준다. 나머지는 npm을 통해 설치한 node_modules가 큰 영역을 차지하는 것을 확인할 수 있음.

위 이미지의 refractor는 뭐길래 용량의 절반을 차지할까? package-lock.json은 우리가 사용하는 패키지의 하위 디펜던시 패키지 목록을 가지고 있다. 해당 목록에서 refractor를 검색해보면 react-syntax-highlighter 패키지에서 사용하는 것을 확인할 수 있다.

`package-lock.json`

```json
"node_modules/react-syntax-highlighter": {
  "version": "12.2.1",
  "resolved": "https://registry.npmjs.org/react-syntax-highlighter/-/react-syntax-highlighter-12.2.1.tgz",
  "integrity": "sha512-CTsp0ZWijwKRYFg9xhkWD4DSpQqE4vb2NKVMdPAkomnILSmsNBHE0n5GuI5zB+PU3ySVvXvdt9jo+ViD9XibCA==",
  "dependencies": {
    "@babel/runtime": "^7.3.1",
    "highlight.js": "~9.15.1",
    "lowlight": "1.12.1",
    "prismjs": "^1.8.4",
    "refractor": "^2.4.1"
  }
},
```

그럼 react-syntax-highlighter 모듈이 어디에서 사용되고 있을까 ? 바로 아래 파일에서 사용되고 있다.

`src/components/markdowns/CodeBlock.js`

```jsx
import React from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism'

function CodeBlock(props) {
  const { language, value } = props
  return (
    // ..
  )
}

export default CodeBlock
```

그렇다면 `CodeBlock`를 리스트페이지가 아닌 사용하는 상세페이지에서만 해당 패키지를 불러오면 성능이 훨씬 개선될 수 있을 것으로 보인다! 이처럼 사이즈를 많이 차지하는 영역이 어디에서 사용하는지 확인하고, 우리는 페이지별로 분리시켜 저장하고 필요할 떄마다 로드하면 바람직해보인다.

### Code Splitting & Lazy Loading

지난 시간에 bundle 사이즈를 파악하던 중 refractor 파일에서 불필요한 리소스 낭비가 발생하는 점을 확인했다. 이러한 점을 코드 스플리팅을 통해 리소스 낭비를 개선할 수 있다.

그렇다면 code splitting은 뭘까? 바로 코드를 분할하는 것이다. 덩치가 큰 번들 파일을 쪼개 작은 파일로 나누는 것이다. 현재 번들 파일은 아래와 같은 구조임을 알 수 있다.

![](../../img/220709-1.png)

파일이 하나로 만들어져있으므로 ListPage에서 ViewPage의 파일까지 로드하므로 파일이 커지고, 페이지 로딩 속도 또한 느려지는 것이다. 따라서 아래와 같은 구조로 쪼개서 접속한 페이지에 필요한 코드들만 불러와 구현하도록 변경하고자 한다.

![](../../img/220709-2.png)

코드 스플리팅은 다양한 방법이 있다. 위처럼 페이지 별로 나눌 수 있고, 페이지별로 공통으로 사용하는 것은 모듈별로 나누어 분할할 수도 있다. 또한 두 가지 방식을 모두 사용하는 방법도 있을 수 있다.

방법은 다양하다. 우리가 집중할 것은 불필요한 코드 또는 중복되는 코드가 없이 적절한 사이즈의 코드가 적절한 타이밍에 로드될 수 있도록 하는 것에 집중하는 것이다.

코드 분할에 대한 방식은 React 공식 홈페이지에서 다양하게 제공하고 있다.
우리는 그 중에 [Route-based code splitting](https://ko.reactjs.org/docs/code-splitting.html#route-based-code-splitting)을 활용해보도록 한다.

위 방식은 아래와 같은 코드로 만드는 것을 의미한다.

```jsx
import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const Home = lazy(() => import("./routes/Home"));
const About = lazy(() => import("./routes/About"));

const App = () => (
  <Router>
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Suspense>
  </Router>
);
```

lazy 함수가 우리가 원할 때(해당 route에 도착했을 때) 원하는 컴포넌트 파일을 호출해오도록 해준다.
Suspense 모듈의 역할은 컴포넌트의 동적 렌더링 순간에 아무것도 존재하지 않는 순간에 에러 대신 loading 요소 등을 노출하도록 구성할 수 있도록 해준다.

본격적으로 위 코드를 적용하기에 앞서 code splitting에 대한 것은 webpack에서 하는 것이므로 webpack 설정을 확인해야 한다. 하지만 우리는 cli 설정으로 프로젝트를 구성했으므로 webpack에 대한 code splitting이 모두 지원되므로 별도로 webpack 설정을 해줄 필요는 없다. ([하지만 참고는 하자](https://webpack.js.org/).)

`src/App.js`

```jsx
import React, { Suspense, lazy } from "react";
import { Switch, Route } from "react-router-dom";
import "./App.css";

const ListPage = lazy(() => import("./pages/ListPage/index"));
const ViewPage = lazy(() => import("./pages/ViewPage/index"));

function App() {
  return (
    <div className="App">
      <Suspense fallback={<div>로딩중...</div>}>
        <Switch>
          <Route path="/" component={ListPage} exact />
          <Route path="/view/:id" component={ViewPage} exact />
        </Switch>
      </Suspense>
    </div>
  );
}

export default App;
```

위와 같이 변경하면 화면이 에러없이 구현되며, 페이지가 구현되기 전에 `로딩중…` 텍스트가 잘 노출되는 것을 확인할 수 있다. 그렇다면 실제 번들파일이 어떻게 달라졌는지 확인해보자!

![](../../img/220709-3.png)

기존 파일과는 다르게 두 개의 영역이 분리되어 번들 파일이 생성된 것을 확인할 수 있다. 실제 페이지를 로드했을 때에도 호출되는 파일이 조금 다르다.

![](../../img/220709-4.png)

페이지 이동에 따라 index.chunk.js 등으로 파일이 분할되어 조각조각 호출되는 것을 확인할 수 있다 🙂

### 텍스트 압축 적용

이제 LightHouse로 평가를 해보면 점수가 많이 올라가있는 것을 확인할 수 있다. 하지만 이는 아직 개발환경에서의 평가이므로 실제 프로덕션 단계에서의 평가는 약간의 차이가 있다. 예를들어 프로덕션에서는 추가적인 minify 작업 등을 통해 성능 상의 차이가 발생하는 것이다. 따라서 실제 서비스 환경에서 측정하는 것이 가장 적절한 평가치가 될 것이다.

따라서 이번 시간에는 `npm run serve`통해 실제 프로덕션 제품을 빌드한 뒤 배포 주소에서 확인해본다. 당연히 단순 빌드만 한 것이기 때문에 성능 상 크게 차이는 발생하지 않는다.

Lighthouse의 리포트를 보면 Enable text compression이라는 항목이 보인다. 이 항목은 서버에서 텍스트를 받을 때 압축된 텍스트를 받으라는 것을 의미한다. 이것은 무엇일까?

웹페이지를 로드할 때에는 다양한 리소스들이 같이 다운받아진다. html, css, js 등 텍스트로 이루어진 파일들이다. 이 파일의 크기가 클수록 로딩 속도가 오래 걸리게 된다. 이를 개선하기 위해 앞서 code splitting을 해보았고, 이번에는 텍스트 압축을 적용해보려고 한다. 텍스트 압축은 간단히 파일 사이즈를 압축하는 것이라고 생각한다.

![](../../img/220711-1.png)

실제 api로 전닯받는 `/articles` network 내역을 보면 content-Encoding 이라는 항목에 gzip으로 텍스트 압축이 되어 정보를 전달받는 것을 확인할 수 있다. 그에 반해 기본적으로 우리가 이용하는 번들링된 파일에는 해당 처리가 되어 있지 않는 것을 확인할 수 있다.

텍스트 압축(text compression)에는 웹 상에서 대표적으로 GZIP과 Deflate라는 압축 알고리즘을 사용한다. Deflate는 LZ77이라는 알고리즘 + 허프만코딩을 사용해 압축하며, GZIP은 블럭화 + 필터링 + 헤드와 checksum 및 내부적으로 Deflate를 사용하는 알고리즘을 채택한다. 따라서 GZIP은 Deflate보다 더 좋은 성능을 보여준다. 따라서 이 파일애도 텍스트 압축을 해주는 것이 좋겠다.

```json
"serve": "npm run build && node ./node_modules/serve/bin/serve.js -u -s build",
```

위 cli 명령어가 실제 실서버에 배포되는 명령어를 담은 것이므로 이를 수정해주면 될 것 같다. 위 커맨드에 담긴 다양한 명령어들에 대한 정보를 찾아보자!

```bash
> node ./node_modules/serve/bin/serve.js --help
UPDATE AVAILABLE The latest version of `serve` is 13.0.4

  serve - Static file serving and directory listing

  USAGE

      $ serve --help
      $ serve --version
      $ serve folder_name
      $ serve [-l listen_uri [-l ...]] [directory]

      By default, serve will listen on 0.0.0.0:5000 and serve the
      current working directory on that address.

      Specifying a single --listen argument will overwrite the default, not supplement it.

  OPTIONS

      --help                              Shows this help message

      -v, --version                       Displays the current version of serve

      -l, --listen listen_uri             Specify a URI endpoint on which to listen (see below) -
                                          more than one may be specified to listen in multiple places

      -d, --debug                         Show debugging information

      -s, --single                        Rewrite all not-found requests to `index.html`

      -c, --config                        Specify custom path to `serve.json`

      -n, --no-clipboard                  Do not copy the local address to the clipboard

      -u, --no-compression                Do not compress files

      --no-etag                           Send `Last-Modified` header instead of `ETag`

      -S, --symlinks                      Resolve symlinks instead of showing 404 errors

      --ssl-cert                          Optional path to an SSL/TLS certificate to serve with HTTPS

      --ssl-key                           Optional path to the SSL/TLS certificate's private key

  ENDPOINTS

      Listen endpoints (specified by the --listen or -l options above) instruct serve
      to listen on one or more interfaces/ports, UNIX domain sockets, or Windows named pipes.
```

위 내용에 보면 -u 명령어가 text-compression을 막는 명령어임을 확인할 수 있다. 따라서 해당 명령어를 제거한 뒤 다시 빌드하여 실서버를 열어본다!.

```json
"serve": "npm run build && node ./node_modules/serve/bin/serve.js -s build",
```

위 방법은 cli를 사용하는 테스트 환경에서 적용하는 방법이며, 기본적인 실제 서비스에서는 다양한 서비스가 연계되어 여러 서버를 띄워 사용하므로 해당 파일이 배포되는 곳에서 직접 텍스트 압축을 실행해주어야 한다.

![](../../img/220711-2.png)

위처럼 번들링된 파일에 gzip 압축이 되어 있는 것을 확인할 수 있다. 그런데 css 파일 등에는 content-encoding 항목이 없는 것을 확인할 수 있다. 왜일까? 압축하는 데에도 시간이 걸리지만 압축을 푸는데에도 시간이 걸리기 때문에 모든 파일을 무분별하게 압축을 해서 전달하는 것은 비효율적이기 때문이다. 따라서 cli에서는 파일 크기가 2kb보다 클 경우에만 압축을 하고, 그것보다 낮은 파일의 경우 압축을 진행하지 않는다.

이처럼 텍스트 인코딩은 빠르고 효율적으로 성능을 향상시킬 수 있는 방법이므로 실무에 아직 적용 전이라면 반드시 적용해보자~!

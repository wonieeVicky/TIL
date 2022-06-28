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

## 웹 크롤링과 데이터 파싱

<aside>
💡 crawl : 기어다니다. 
web crawler: 봇이 웹사이트를 기어다니도록 만드는 프로그램

</aside>

### 웹 크롤러가 필요한 이유?

- 웹 사이트에 정보가 있기 때문. 정보를 수집하기 위해 만드는 프로그램
- 영리적 목적은 별도로 정보 수집에 대한 허락을 받거나 open API를 쓰도록 한다.
- 불법이 될 수 있으므로 아무데서나 하면 안되고, 허락된 정보만 수집한다.
- python, java, nodejs 로 크롤링 가능,
  nodejs는 javascript 언어를 사용하므로 웹 구성 언어인 자바스크립트로 수집하기 때문에 호환성과 생산성이 다른 언어에 비해 좋음

### csv-parse 패키지로 csv 파싱하기

먼저 프로젝트 폴더를 새로 만들어 npm init을 해준다.

npm start에 node가 동작하도록 처리한다.

```json
{
  "name": "1-csv-parsing-example",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "node index"
  },
  "author": "Vicky",
  "license": "MIT",
  "dependencies": {
    "csv-parse": "^5.0.4"
  }
}
```

`csv-parser`라는 라이브러리로 csv를 파싱한다.

```bash
> npm i csv-parse
```

<aside>
💡 CSV : Comma Seperated Value 즉, 콤마(,)와 줄바꿈으로 구분된 값을 의미한다.

프로그래밍에서 많이 쓰이는 2차원 데이터 저장 방식이다.

</aside>

테스트할 `data.csv`의 파일은 아래와 같다고 하자.

```
타이타닉,https://movie.naver.com/movie/bi/mi/basic.nhn?code=18847
아바타,https://movie.naver.com/movie/bi/mi/basic.nhn?code=62266
매트릭스,https://movie.naver.com/movie/bi/mi/basic.nhn?code=24452
반지의 제왕,https://movie.naver.com/movie/bi/mi/basic.nhn?code=31794
어벤져스,https://movie.naver.com/movie/bi/mi/basic.nhn?code=72363
겨울왕국,https://movie.naver.com/movie/bi/mi/basic.nhn?code=100931
트랜스포머,https://movie.naver.com/movie/bi/mi/basic.nhn?code=61521
해리 포터,https://movie.naver.com/movie/bi/mi/basic.nhn?code=30688
다크나이트,https://movie.naver.com/movie/bi/mi/basic.nhn?code=62586
캐리비안의 해적,https://movie.naver.com/movie/bi/mi/basic.nhn?code=37148
```

`index.js`

```jsx
const fs = require("fs");

const csv = fs.readFileSync("csv/data.csv"); // 0, 1로 이루어진 컴퓨터 친화적인 버퍼 데이터
const test = csv.toString("utf-8"); // 문자열로 변환
console.log(test); // data.csv 반환
```

위와 같이 fs로 `csv/data.csv`를 불러와 문자열로 변환하면 위 `data.csv`가 불러와진다.

해당 내용을 `csv-parse`로 파싱해보자

```jsx
const parse = require("csv-parse/lib/sync");
const fs = require("fs");

const csv = fs.readFileSync("csv/data.csv");
const records = parse(csv.toString("utf-8"));
records.forEach((r, i) => {
  console.log(i, r);
});

// 0 [ '타이타닉', 'https://movie.naver.com/movie/bi/mi/basic.nhn?code=18847' ]
// 1 [ '아바타', 'https://movie.naver.com/movie/bi/mi/basic.nhn?code=62266' ]
// 2 [ '매트릭스', 'https://movie.naver.com/movie/bi/mi/basic.nhn?code=24452' ]
// ..
```

즉 `r[0]`이 영화 제목, `r[1]`이 영화 링크를 의미함

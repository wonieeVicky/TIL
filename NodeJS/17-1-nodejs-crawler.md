﻿## 웹 크롤링과 데이터 파싱

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

### xlsx 패키지로 엑셀 파싱하기

기획자나 마케팅 담당자가 csv 파일로 전달해주면 베스트지만, 만약 xlsx 파일로 정보를 전달한다면 어떻게 해야할까? xlsx 패키지로 엑셀을 파싱해야 한다. (xlsx 파싱은 혼자 구현하기 매우 힘드므로 패키지에 의존한다)

```bash
> npm i xlsx
```

해당 라이브러리를 적용하면, 아래와 같이 값이 Sheets 요소에 읽힌다.

```jsx
const xlsx = require("xlsx");
const workbook = xlsx.readFile("xlsx/data.xlsx"); // readFile로 엑셀을 읽음

console.log(workbook);

/* {
  Directory: {
    // ..
  },
  Workbook: {
    // ..
  },
  Props: {
    // ..
  },
  Custprops: {},
  Deps: {},
  Sheets: {
    '영화목록': {
      '!ref': 'A1:B11',
      A1: [Object],
      B1: [Object],
      A2: [Object],
      B2: [Object],
      A3: [Object],
      B3: [Object],
      A4: [Object],
      B4: [Object],
      A5: [Object],
      B5: [Object],
      A6: [Object],
      B6: [Object],
      A7: [Object],
      B7: [Object],
      A8: [Object],
      B8: [Object],
      A9: [Object],
      B9: [Object],
      A10: [Object],
      B10: [Object],
      A11: [Object],
      B11: [Object],
      '!margins': [Object]
    }
  },
  SheetNames: [ '영화목록' ],
  Strings: [
    //..
  ],
  //..
} */
```

이 객체와 xlsx 함수들을 사용해 아래와 같이 정보를 꺼낼 수 있다.

```jsx
const xlsx = require("xlsx");
const workbook = xlsx.readFile("xlsx/data.xlsx"); // readFile로 엑셀을 읽음

// console.log(Object.keys(workbook.Sheets)); // 영화목록

const ws = workbook.Sheets.영화목록;
const records = xlsx.utils.sheet_to_json(ws); // sheet_to_json 함수로 파싱한다.
console.log(records);

/*[
  {
    '제목': '타이타닉',
    '링크': 'https://movie.naver.com/movie/bi/mi/basic.nhn?code=18847'
  },
  {
    '제목': '아바타',
    '링크': 'https://movie.naver.com/movie/bi/mi/basic.nhn?code=62266'
  },
	// ..
] */

// 배열.entries를 쓰면 내부 배열이 [인덱스, 값]모양 이터레이터로 바뀜
for (const [i, r] of records.entries()) {
  console.log(i, r.제목, r.링크);
}

/*
0 타이타닉 https://movie.naver.com/movie/bi/mi/basic.nhn?code=18847
1 아바타 https://movie.naver.com/movie/bi/mi/basic.nhn?code=62266
2 매트릭스 https://movie.naver.com/movie/bi/mi/basic.nhn?code=24452
3 반지의 제왕 https://movie.naver.com/movie/bi/mi/basic.nhn?code=31794
4 어벤져스 https://movie.naver.com/movie/bi/mi/basic.nhn?code=72363
5 겨울왕국 https://movie.naver.com/movie/bi/mi/basic.nhn?code=100931
6 트랜스포머 https://movie.naver.com/movie/bi/mi/basic.nhn?code=61521
7 해리 포터 https://movie.naver.com/movie/bi/mi/basic.nhn?code=30688
8 다크나이트 https://movie.naver.com/movie/bi/mi/basic.nhn?code=62586
9 캐리비안의 해적 https://movie.naver.com/movie/bi/mi/basic.nhn?code=37148
*/
```

### axios-cheerio 크롤링 구현

위와 같이 xlsx, csv 파일을 파싱하는 것을 구현해보았다. 이제 위 파일들에 담긴 링크로 실제 페이지로 이동하여 크롤링하는 것을 구현해보자. axios-cheerio 조합으로 간단한 페이지를 가져올 수 있음. 우선 패키지를 설치한다.

```bash
> npm i axios cheerio
```

axios는 ajax 라이브러리이며, cheerio는 html을 파싱해주는 패키지이다.
이를 크롤링 코드에 적용해보면 아래와 같다.

```jsx
const xlsx = require("xlsx");
const axios = require("axios"); // ajax 라이브러리
const cheerio = require("cheerio"); // html 파싱

const workbook = xlsx.readFile("xlsx/data.xlsx");
const ws = workbook.Sheets.영화목록;
const records = xlsx.utils.sheet_to_json(ws);

const crawler = async () => {
  await Promise.all(
    records.map(async (r) => {
      const response = await axios.get(r.링크);
      if (response.status === 200) {
        // 응답이 성공한 경우
        const html = response.data;
        console.log(html);
      }
    })
  );
};

crawler();
```

위와 같이 crawler 함수를 실행시키면, `html`이 `response.data`로 반환되는 것을 확인할 수 있다. 이러한 데이터를 바탕으로 한 영역의 데이터를 받아온다고 하면, 아래와 같이 추가해준다.

```jsx
// ..
const crawler = async () => {
  await Promise.all(
    records.map(async (r) => {
      const response = await axios.get(r.링크);
      if (response.status === 200) {
        const html = response.data;
        const $ = cheerio.load(html); // cheerio로 html 적용
        const text = $(".score.score_left .star_score").text(); // 가져오고자 하는 데이터 호출
        console.log(r.제목, "평점:", text.trim());
      }
    })
  );
};

crawler();
// 타이타닉 평점: 9.41
// 어벤져스 평점: 8.80
// 반지의 제왕 평점: 9.30
// 다크나이트 평점: 9.34
// 캐리비안의 해적 평점: 9.07
// 겨울왕국 평점: 9.13
// 아바타 평점: 9.07
// 트랜스포머 평점: 8.85
// 매트릭스 평점: 9.40
// 해리 포터 평점: 9.36
```

### Promise.all과 for of 문의 차이

위 크롤링에서 주의해야할 점은 xlsx 파일 목록에 적힌 데이터의 순서대로 결과가 반환되는 것이 아니라는 사실이다. 즉 `Promise.all`은 동시에 진행되지만 순서가 보장되지 않는다는 특징을 가진다.

만약 엑셀에 적힌 순서대로 데이터를 반환받고 싶다면 코드가 좀 달라져야 한다.

```jsx
// ..
const crawler = async () => {
  //  await Promise.all(records.map(async (r) => {})); 대신 for ~ of문 사용
  for (const [i, r] of records.entries()) {
    const response = await axios.get(r.링크);
    if (response.status === 200) {
      // 응답이 성공한 경우
      const html = response.data;
      const $ = cheerio.load(html);
      const text = $(".score.score_left .star_score").text(); // tag는 무시하고 텍스트만 가져온다.
      console.log(r.제목, "평점:", text.trim());
    }
  }
};

crawler();
// 타이타닉 평점: 9.41
// 아바타 평점: 9.07
// 매트릭스 평점: 9.40
// 반지의 제왕 평점: 9.30
// 어벤져스 평점: 8.80
// 겨울왕국 평점: 9.13
// 트랜스포머 평점: 8.85
// 해리 포터 평점: 9.36
// 다크나이트 평점: 9.34
// 캐리비안의 해적 평점: 9.07
```

위처럼 `for~of` 문과 `await`을 조합하면 엑셀에 적혀있는 순서가 보장된다.

그렇다면 당연히 `for~of`가 더 좋으니 해당 방법을 이용해야하는 것 아닐까? 그럴수도 아닐수도 있다.
`Promise.all`은 요청을 한번에 다 보내고 응답을 한번에 받아들일 수 있어서 굉장히 빠른 편
속도와 순서를 trade-off를 적절히 판단하여 사용한다.

### xlsx 패키지

xlsx 패키지 사용방법을 조금 더 알아보자.
먼저 정보를 가져오는 컬럼명을 `r.제목`, `r.링크`로 가져왔는데 이를 컬럼명을 넘버링으로 가져올 수 있다.

![](../img/220307-1.png)

즉, 위 이미지에서 `r.A`, `r.B`로 열정보를 가져올 수 있는 것임

```jsx
const xlsx = require("xlsx");

const workbook = xlsx.readFile("xlsx/data.xlsx");
const ws = workbook.Sheets.영화목록;
const records = xlsx.utils.sheet_to_json(ws, { header: "A" });

console.log(records);

/*
[
  { A: '제목', B: '링크' },
  {
    A: '타이타닉',
    B: 'https://movie.naver.com/movie/bi/mi/basic.nhn?code=18847'
  },
  {
    A: '아바타',
    B: 'https://movie.naver.com/movie/bi/mi/basic.nhn?code=62266'
  },
	// ..
]
```

하지만 맨 첫번째 줄인 `{ A: '제목', B: '링크' }` 부분이 그대로 데이터에 들어오고 있다.
이를 제거하기 위해 shift 함수를 적용해서 처리해줄 수도 있겠음 ㅎㅎ

다음으로 엑셀에 전체 정보가 적힌 범위를 파싱하기 위한 방법을 확인해보자.

```jsx
const xlsx = require("xlsx");
const axios = require("axios"); // ajax 라이브러리
const cheerio = require("cheerio"); // html 파싱

const workbook = xlsx.readFile("xlsx/data.xlsx");
const ws = workbook.Sheets.영화목록;
const records = xlsx.utils.sheet_to_json(ws, { header: "A" });

console.log(ws["!ref"]); // A1:B11
```

위와 같이 `ws[”!ref”]`를 로깅해보면 `A1:B11`이 나온다. 전체 정보가 적힌 범위를 파싱한 것임
하지만 웹크롤러는 `A2:B11`까지만 움직여야하므로 아래와 같이 바꿔주면 된다.

```jsx
const xlsx = require("xlsx");
const axios = require("axios"); // ajax 라이브러리
const cheerio = require("cheerio"); // html 파싱

const workbook = xlsx.readFile("xlsx/data.xlsx");
const ws = workbook.Sheets.영화목록;
ws["!ref"] = ws["!ref"]
  .split(":")
  .map((v, i) => (i === 0 ? "A2" : v))
  .join(":");
// 혹은 ws["!ref"] = 'A2:B11'로 직접 변경 가능 ㅋ
console.log(ws["!ref"]); // A2:B11

const records = xlsx.utils.sheet_to_json(ws, { header: "A" });
console.log(records);

/*
[
  {
    A: '타이타닉',
    B: 'https://movie.naver.com/movie/bi/mi/basic.nhn?code=18847'
  },
  {
    A: '아바타',
    B: 'https://movie.naver.com/movie/bi/mi/basic.nhn?code=62266'
  },
	// ..
]
*/
```

위와 같이 `ws[”!ref”]` 값을 바꿔준 뒤 records를 조회해오면 A1영역이 제외되어 정확하게 정보를 불러오는 것을 확인할 수 있다. 이 밖에도 시트가 여러가지인 경우에는 어떻게 할까? `workbook`에서 제공하는 `SheetNames`라는 메서드를 이용한다.

```jsx
const xlsx = require("xlsx");

const workbook = xlsx.readFile("xlsx/data.xlsx");
console.log(workbook.SheetNames); // [ '영화목록', "Sheet1", "Sheet2", "Sheet3" ]

for (const name of workbook.SheetNames) {
  const ws = workbook.Sheets.name;
  // 시트별로 따로 크롤링 할 수 있다!
}
```

위처럼 `workbook.SheetNames`를 조회하여 `for~of`문으로 돌리면 각 시트별로 크롤링을 할 수 있게된다.

### 크롤링한 정보 엑셀에 쓰기

크롤링을 완료했다면 수집된 정보를 엑셀에 적어넣어야 한다. 해당 로직을 살펴보자.

먼저 크롤링한 정보를 sheet에 추가하는 유틸함수를 xlsx 패키지에서 제공하므로 해당 유틸을 옮겨넣는다.

`./add_to_sheet.js`

제공되는 유틸함수이므로 사용에 집중한다.!

```jsx
const xlsx = require("xlsx");

function range_add_cell(range, cell) {
  var rng = xlsx.utils.decode_range(range);
  var c = typeof cell === "string" ? xlsx.utils.decode_cell(cell) : cell;
  if (rng.s.r > c.r) rng.s.r = c.r;
  if (rng.s.c > c.c) rng.s.c = c.c;

  if (rng.e.r < c.r) rng.e.r = c.r;
  if (rng.e.c < c.c) rng.e.c = c.c;
  return xlsx.utils.encode_range(rng);
}

module.exports = function add_to_sheet(sheet, cell, type, raw) {
  sheet["!ref"] = range_add_cell(sheet["!ref"], cell);
  sheet[cell] = { t: type, v: raw };
};
```

`index.js`

```jsx
// ..
const add_to_sheet = require("./add_to_sheet"); // add_to_sheet 호출

const workbook = xlsx.readFile("xlsx/data.xlsx");
const ws = workbook.Sheets.영화목록;
const records = xlsx.utils.sheet_to_json(ws);

const crawler = async () => {
  add_to_sheet(ws, "C1", "s", "평점"); // C1(타이틀 영역)에 '평점'이라는 string 추가
  for (const [i, r] of records.entries()) {
    const response = await axios.get(r.링크);
    if (response.status === 200) {
      const html = response.data;
      const $ = cheerio.load(html);
      const text = $(".score.score_left .star_score").text();
      const newCell = "C" + (i + 2); // 값을 넣을 cell을 지정
      add_to_sheet(ws, newCell, "n", parseFloat(text.trim()));
    }
  }
  xlsx.writeFile(workbook, "xlsx/result.xlsx"); // 해당 업데이트 파일을 result.xlsx로 저장
};

crawler();
```

위와 같이 writeFile을 처리하면 result.xlsx 파일에 평점 raw가 추가된 것을 확인할 수 있다.

![](../img/220309-1.png)

이를 좀 더 활용하면 주연, 감독, 리뷰 정보 등 필요한 정보를 업데이트할 수 있게 된다.

## puppeteer 사용하기

### puppeteer 시작하기

간단한 페이지의 웹 크롤링은 axios, cheerio를 사용해서 처리할 수 있지만, 최근 spa 페이지로 개발되는 웹 환경과 웹크롤러 접근을 막는 일부 브라우저들이 발생함에 따라 웹 크롤링을 위해 만들어진 라이브러리가 필요해졌다. 이때 사용하는 것이 puppeteer이다. puppeteer로는 userAgent를 bot이 아닌 일반 브라우저로 속여서 접근이 가능하다. (axios에서도 가능은 함)

```bash
> npm i puppeteer
```

puppeteer는 패키지를 다운받을 때 크로미움 브라우저를 함꼐 다운받는데, 이는 서버에서 크롬 브라우저를 실제 실행하여 처리하기위해 다운받아지는 것으로, 용량을 좀 차지한다는 점 참고하자(메모리 1G정도)

이제 puppeteer를 실제 코드에 적용해보자.

`index.js`

```jsx
const parse = require("csv-parse/lib/sync");
const fs = require("fs");
const puppeteer = require("puppeteer");

const csv = fs.readFileSync("csv/data.csv");
const records = parse(csv.toString("utf-8"));

const crawler = async () => {
  const browser = await puppeteer.launch({ headless: false }); // browser 객체 생성
  const page1 = await browser.newPage();
  const page2 = await browser.newPage();
  const page3 = await browser.newPage();
  await page1.goto("https://github.com/wonieeVicky");
  await page2.goto("https://www.naver.com");
  await page3.goto("https://www.google.com");
  await page1.waitForTimeout(3000); // 3초 대기
  await page2.waitForTimeout(1000); // 1초 대기
  await page3.waitForTimeout(2000); // 1초 대기
  await page1.close(); // 페이지 Close
  await page2.close(); // 페이지 Close
  await page3.close(); // 페이지 Close
  await browser.close(); // 브라우저 Close
};

crawler();
```

위와 같이 처리한 뒤 npm start를 하면 자동으로 차례대로 page1, page2, page3을 방문 한 뒤 정해진 대기 시간이 지나면 페이지가 close되고, 브라우저까지 최종 종료되는 것을 확인할 수 있다.

![](../img/220310-1.gif)

### headless 옵션 이해하기

`puppeteer.launch({ headless: false });` 옵션에서 `headless`를 `true`로 하면 어떻게 될까?
`headless`는 화면을 의미한다. 화면이 없는 브라우저를 사용하는 것을 의미한다.

그런데 왜 화면이 없는 브라우저를 써야하는 걸까? 크롤러가 움직이는 환경은 특정 서버이다. 서버는 보통 명령 크롬프트로 움직이는 것이 대부분이며 눈에 보이지 않기 때문에 최대한 코드로만 조작하는 것을 의미한다.

따라서 개발 시에만 `headless`를 `false`로 두고, 이외에는 별도의 옵션을 주지않으면 `true`로 처리되므로 서버에서 동작시키면 된다. 만일 `headless` 상태에서 디버깅을 하고 싶을 경우 `console.log`를 사용하면된다.

```jsx
//..
const crawler = async () => {
  const browser = await puppeteer.launch({ headless: process.env.NODE_ENV === "production" });
  const page1 = await browser.newPage();
  const page2 = await browser.newPage();
  const page3 = await browser.newPage();
  await page1.goto("https://github.com/wonieeVicky");
  await page2.goto("https://www.naver.com");
  await page3.goto("https://www.google.com");
  console.log("working");
  await page1.close(); // 페이지 Close
  await page2.close(); // 페이지 Close
  await page3.close(); // 페이지 Close
  await browser.close(); // 브라우저 Close
};

crawler();
```

```jsx
> npm start

> 1-csv-parsing-example@1.0.0 start
> node index

working
```

또 현재 구조상 page1~page3까지 await 속성에 따라 순차적으로 방문이 진행되므로 이는 동시다발적인 진행이라고 보기 어렵다. 이러한 구조를 개선하기 위해 `Promise.all` 을 사용하여 처리한다.

```jsx
const crawler = async () => {
  const browser = await puppeteer.launch({ headless: process.env.NODE_ENV === "production" });
  const [page1, page2, page3] = await Promise.all([browser.newPage(), browser.newPage(), browser.newPage()]);
  await Promise.all([
    page1.goto("https://github.com/wonieeVicky"),
    page2.goto("https://www.naver.com"),
    page3.goto("https://www.google.com"),
  ]);
  await Promise.all([page1.waitForTimeout(3000), page2.waitForTimeout(500), page3.waitForTimeout(2000)]);
  await page1.close();
  await page2.close();
  await page3.close();
  await browser.close();
};
```

위처럼 처리하면 순차처리가 아닌 동시 처리로 변경해줄 수 있다.

### 첫 puppeteer 크롤링

puppeteer 옵션을 어느정도 알아봤다면 실제 puppeteer를 사용해 크롤링을 구현해본다.

```jsx
const parse = require("csv-parse/lib/sync");
const fs = require("fs");
const puppeteer = require("puppeteer");

const csv = fs.readFileSync("csv/data.csv");
const records = parse(csv.toString("utf-8"));

const crawler = async () => {
  // try ~ catch는 async 함수 내부에서 사용하여 에러를 잡는다.
  try {
    const browser = await puppeteer.launch({ headless: process.env.NODE_ENV === "production" });
    // Promise.all로 동시 크롤링
    await Promise.all(
      records.map(async (r, i) => {
        // 내부 async 함수에 대한 try ~ catch 적용
        try {
          const page = await browser.newPage(); // 동시에 페이지 10개 오픈
          await page.goto(r[1]); // 동시에 페이지 방문
          const scoreEl = await page.$(".score.score_left .star_score"); // 별점 엘리먼트로 이동
          if (scoreEl) {
            // 태그를 잘 찾았으면 evaluate 함수를 통해 찾은 태그로 textContent를 반환
            const text = await page.evaluate((tag) => tag.textContent, scoreEl); // 평점
            // console.log(r[0], "평점", text.trim());
          }
          await page.waitForTimeout(3000); // 웹크롤러 방지 코드에 걸리지 않도록 처리
          await page.close();
        } catch (e) {
          console.error(e);
        }
      })
    );
    await browser.close(); // 브라우저 Close
  } catch (e) {
    console.error(e);
  }
};

crawler();
```

- async ~ await 함수에 에러를 잡는 방법은 try ~ catch 문으로 감싸주는 것임.
  하나의 async ~ await에 하나의 try ~ catch 문이 처리되므로 내부에 async ~ await 함수가 또 있는 경우 해당 영역에 대한 try ~ catch를 추가해줘야 한다.
- 실제 엘리먼트를 가져왔는지 if 분기로 조건을 걸어주는 것이 좋다.
- 웹크롤러일 경우 브라우저에서 막힐 경우가 있으므로 적절하게 waitForTimeout 속성을 주어 크롤링해준다.

### csv에 크롤링한 데이터 출력하기

위처럼 웹크롤링을 돌려 얻어진 데이터를 csv 파일에 추가해보자. 이를 위해 간단한 패키지 하나를 설치해준다.

```bash
> npm i csv-stringify
```

그리고 위 코드를 크롤러에 아래와 같이 적용해준다.

```jsx
// ..
const { stringify } = require("csv-stringify/sync");

const crawler = async () => {
  try {
    const result = []; // stringify 할 배열 생성
    const browser = await puppeteer.launch({ headless: process.env.NODE_ENV === "production" });
    await Promise.all(
      records.map(async (r, i) => {
        try {
          const page = await browser.newPage();
          await page.goto(r[1]);
          const scoreEl = await page.$(".score.score_left .star_score");
          if (scoreEl) {
            const text = await page.evaluate((tag) => tag.textContent, scoreEl);
            result.push([r[0], r[1], text.trim()]); // 2차원 배열이 된다.
          }
          await page.waitForTimeout(3000);
          await page.close();
          const str = stringify(result); // 문자열로 만들어준 뒤
          fs.writeFileSync("csv/result.csv", str); // result.csv란 파일로 내보낸다.
        } catch (e) {
          console.error(e);
        }
      })
    );
    // ...
  } catch (e) {
    console.error(e);
  }
};

crawler();
```

위처럼 하면 기존의 아래와 같은 `data.csv` 파일을

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

아래와 같은 `result.csv` 파일로 도출할 수 있다.

```
캐리비안의 해적,https://movie.naver.com/movie/bi/mi/basic.nhn?code=37148,9.07
타이타닉,https://movie.naver.com/movie/bi/mi/basic.nhn?code=18847,9.41
반지의 제왕,https://movie.naver.com/movie/bi/mi/basic.nhn?code=31794,9.30
매트릭스,https://movie.naver.com/movie/bi/mi/basic.nhn?code=24452,9.40
다크나이트,https://movie.naver.com/movie/bi/mi/basic.nhn?code=62586,9.34
트랜스포머,https://movie.naver.com/movie/bi/mi/basic.nhn?code=61521,8.85
아바타,https://movie.naver.com/movie/bi/mi/basic.nhn?code=62266,9.07
겨울왕국,https://movie.naver.com/movie/bi/mi/basic.nhn?code=100931,9.13
어벤져스,https://movie.naver.com/movie/bi/mi/basic.nhn?code=72363,8.80
해리 포터,https://movie.naver.com/movie/bi/mi/basic.nhn?code=30688,9.36
```

그런데 잘 보면 영화 순서가 원본과 다르게 뒤죽박죽으로 바뀌어있음을 알 수 있다.
`Promise.all`을 사용했을 때 순서를 보장하지 못하고 페이지 로드 순으로 처리되기 때문이다.

배열의 순서를 보장하는 방법으로 이를 개선할 수 있는 데 아래 코드를 보자

```jsx
// ..
const crawler = async () => {
  try {
    const result = [];
    const browser = await puppeteer.launch({ headless: process.env.NODE_ENV === "production" });
    await Promise.all(
      records.map(async (r, i) => {
        try {
          // ..
          if (scoreEl) {
            const text = await page.evaluate((tag) => tag.textContent, scoreEl);
            result[i] = [r[0], r[1], text.trim()]; // 순서 보장을 위해 result 배열의 인덱스로 정보를 저장
          }
          // ..
        } catch (e) {
          console.error(e);
        }
      })
    );
    // ..
  } catch (e) {
    console.error(e);
  }
};
```

위처럼 순서 보장을 위해 result 배열의 인덱스를 특정지어 데이터를 저장하도록 함으로서 동시성과 순서를 모두 보장하는 로직을 구현할 수 있다. (~~단 약간 에러 문구가 나오긴 함..~~)

`result.csv`

```jsx
타이타닉,https://movie.naver.com/movie/bi/mi/basic.nhn?code=18847,9.41
아바타,https://movie.naver.com/movie/bi/mi/basic.nhn?code=62266,9.07
매트릭스,https://movie.naver.com/movie/bi/mi/basic.nhn?code=24452,9.40
반지의 제왕,https://movie.naver.com/movie/bi/mi/basic.nhn?code=31794,9.30
어벤져스,https://movie.naver.com/movie/bi/mi/basic.nhn?code=72363,8.80
겨울왕국,https://movie.naver.com/movie/bi/mi/basic.nhn?code=100931,9.13
트랜스포머,https://movie.naver.com/movie/bi/mi/basic.nhn?code=61521,8.85
해리 포터,https://movie.naver.com/movie/bi/mi/basic.nhn?code=30688,9.36
다크나이트,https://movie.naver.com/movie/bi/mi/basic.nhn?code=62586,9.34
캐리비안의 해적,https://movie.naver.com/movie/bi/mi/basic.nhn?code=37148,9.07
```

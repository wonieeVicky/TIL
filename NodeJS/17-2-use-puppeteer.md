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
	console.log('working');
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
  const [page1, page2, page3] = await Promise.all([
		browser.newPage(), 
		browser.newPage(), 
		browser.newPage()
	]);
  await Promise.all([
    page1.goto("https://github.com/wonieeVicky"),
    page2.goto("https://www.naver.com"),
    page3.goto("https://www.google.com"),
  ]);
  await Promise.all([
		page1.waitForTimeout(3000), 
		page2.waitForTimeout(500), 
		page3.waitForTimeout(2000)
	]);
  await page1.close();
  await page2.close();
  await page3.close();
  await browser.close();
};
```

위처럼 처리하면 순차처리가 아닌 동시 처리로 변경해줄 수 있다.

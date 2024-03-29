﻿## 페이지네이션과 아이프레임 크롤링하기

# 10. 페이지네이션과 아이프레임

### 페이지네이션 크롤링 준비

먼저 아마존 상품 페이지를 크롤링해보려고 한다.
아마존의 경우 페이지 이동 시 url의 쿼리스트링이 바뀌기 때문에 해당 데이터로 즉시 데이터 파싱이 가능함.
어떤 keyword 상품을 검색해서 총 10개의 페이지를 크롤링한다고 한다면 아래와 같이 작성할 수 있다.

`index.js`

```jsx
const puppeteer = require("puppeteer");

const crawler = async () => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      args: ["--window-size=1920,1080", "--disable-notifications", "--no-sandbox"],
    });

    await Promise.all(
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(async (v) => {
        const page = await browser.newPage();
        await page.setViewport({
          width: 1080,
          height: 1080,
        });
        const keyword = "mouse";
        await page.goto(`https://www.amazon.com/s?k=${keyword}&page=${v}`, {
          waitUntil: "networkidle0",
        });
        // data parsing..
      })
    );
  } catch (e) {
    console.error(e);
  }
};

crawler();
```

위처럼 `Promise.all`로 전 페이지가 호출되어 데이터 파싱이 되도록 구조를 잡으면 된다.

### 아마존 실전 크롤링

`index.js`

```jsx
const puppeteer = require("puppeteer");

const crawler = async () => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      args: ["--window-size=1920,1080", "--disable-notifications", "--no-sandbox"],
    });
    let result = [];
    await Promise.all(
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(async (v) => {
				// ..
				const r = await page.evaluate(() => {
          const tags = document.querySelectorAll(".s-result-list > div");
          const result = [];
          tags.forEach((t) => {
            result.push({
              name: t && t.querySelector("h5") && t.querySelector("h5").textContent.trim(),
              price: t && t.querySelector(".a-offscreen") && t.querySelector(".a-offscreen").textContent,
            });
          });
          return result;
        });
        result = result.concat(r); // data 합치기
      })
    );

    console.log(result.length); // 220
    console.log(result[0]); // { name: 'S-Button Wired USB Optical Mouse..', price: '$8.99' }
  }
};
```

위처럼 처리하면 ‘마우스’로 검색된 10개의 페이지 상품들을 크롤링해올 수 있게된다!

### 깃허브 크롤링

`github.js`

```jsx
const puppeteer = require("puppeteer");

const crawler = async () => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      args: ["--window-size=1920,1080", "--disable-notifications", "--no-sandbox"],
    });
    const page = await browser.newPage();
		await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36"
    );
    await page.setViewport({
      width: 1080,
      height: 1080,
    });
    const keyword = "crawler";
    await page.goto(`https://github.com/search?q=${keyword}`, {
      waitUntil: "networkidle0",
    });
    let result = [];
    let pageNum = 1;
		// while 문으로 10페이지까ㅣㅈ 반복
    while (pageNum < 10) {
      const r = await page.evaluate(() => {
        const tags = document.querySelectorAll(".repo-list-item");
        const result = [];
        tags.forEach((t) => {
					// 태그분석하여 데이터 넣어주기
          result.push({
            name: t && t.querySelector("h3") && t.querySelector("h3").textContent.trim(),
            star: t && t.querySelector(".muted-link") && t.querySelector(".muted-link").textContent.trim(),
            lang:
              t &&
              t.querySelector(".text-gray.flex-auto") &&
              t.querySelector(".text-gray.flex-auto").textContent.trim(),
          });
        });
        return result;
      });
      result.push(r);
			// 데이터 크롤링 완료 후 다음 페이지 클릭을 아래와 같이 구현한다.
      await page.waitForSelector(".next_page");
      await page.click(".next_page");
      pageNum++;
    }
    console.log(result.length);
    console.log(result[0]);
  }
};
```

### 깃허브 페이지네이션

위 코드에 부족한 점은 spa 페이지에서 response로 다음 페이지에 대한 정보를 성공적으로 반환받았음을 확인하는 코드가 없다는 것이다.  
따라서 `waitForResponse` 메서드로 해당 response를 체크하여 반복문을 분기처리하도록 한다.

`github.js`

```jsx
//..
const crawler = async () => {
  try {
    // ..
    let result = [];
    let pageNum = 1;
    while (pageNum < 10) {
      // ..
      pageNum++;

      // 다음 페이지의 응답이 완료될 때까지 기다려준다.
      await page.waitForResponse((response) => {
        return response.url().startsWith(`https://github.com/search/count?p=${pageNum}`) && response.status() === 200;
      });
      await page.waitForTimeout(2000); // github 내 prevent crawler 방지를 위함
    }
  } catch (e) {
    console.error(e);
  }
};
```

### 트위터 로그인하기

트위터에서 아이프레임을 크롤링해보도록 하자. 우선 로그인부터 구현한다.
로그인은 굉장히 식은 죽 먹기가 됐다

`twitter.js`

```jsx
const puppeteer = require("puppeteer");
const dotenv = require("dotenv");
dotenv.config();

const crawler = async () => {
  try {
    // ..
    await page.goto("https://twitter.com", { waitUntil: "networkidle0" });
    await page.type(".LoginForm-username input", process.env.EMAIL);
    await page.type(".LoginForm-password input", process.env.PASSWORD);
    await page.waitForSelector('input[type="submit"]');
    await page.click('input[type="submit"]');
		// ..
  }
};
```

### 트위터 태그 분석

iframe은 다른 웹이라고 생각하면 이해가 쉽다.
트위터 게시글 내 아이프레임에 내부에 있는 콘텐츠를 긁어오는 것을 구현해보고자 한다.

`twitter.js`

```jsx
const crawler = async () => {
  try {
		// ..
    await page.waitForNavigation();

    while (await page.$(".js-stream-item")) {
      const firstItem = await page.$(".js-stream-item:first-child");
      if (await page.$(".js-macaw-cards-iframe-container")) {
        await page.evaluate(() => {
          window.scrollBy(0, 10);
        });
        console.log("iframe 발견");
				// iframe response를 기다린다.
        await page.waitForResponse((response) => {
          console.log(response.url());
          return response.url().startsWith("https://twitter.com/i/cards/tfw/v1/");
        });
        await page.waitForSelector(".js-stream-item:first-child iframe");
        const iframe = await page.frames()[0];
        const result = await iframe.evaluate(() => {
          return {
            title: document.querySelector("h2") && document.querySelector("h2").textContent,
          };
        });
        console.log(result);
      } else {
        console.log("iframe 없음");
				// iframe 없으면 해당 li 삭제
        await page.evaluate((item) => item.parentNode.removeChild(item), firstItem);
      }
    }
  }
};
```

트위터는 아이프레임을 바로 호출하는 것이 아닌 스크롤을 살짝 내려야 아이프레임 정보를 가져온다.  
따라서 li(`.js-stream-item`)이 있을 경우 해당 돔을 살짝 스크롤을 내려 iframe 을 호출해오는 것을 함께 구현해야 함

### 아이프레임 컨텐츠 가져오기

위 코드에 이어 아이프레임 컨텐츠 가져오는 것을 완성해본다.

`twitter.js`

```jsx
//..
const crawler = async () => {
  try {
    // login..
    while (await page.$(".js-stream-item")) {
      const firstItem = await page.$(".js-stream-item:first-child");
      if (await page.$(".js-stream-item:first-child .js-macaw-cards-iframe-container")) {
				// 1. 찾고자하는 iframe id 가져오기
        const tweetId = await page.evaluate((item) => item.dataset.itemId, firstItem);
				// 2. 스크롤을 살짝 내린다.
        await page.evaluate(() => window.scrollBy(0, 10));
				// 3. iframe 기다림
        await page.waitForSelector(".js-stream-item:first-child iframe");
				// 4. 같은 tweetId를 가진 iframe 가져오기
        const iframe = await page.frames().find((frame) => frame.url().includes(tweetId)); // 원하는 iframe 가져오기
        if (iframe) {
					// 5. iframe 콘텐츠 가져오기
          const result = await iframe.evaluate(() => ({
            title: document.querySelector("h2") && document.querySelector("h2").textContent,
          }));
          console.log(result); // 6. { title: '알리바바 미래호텔 모습' }
        }
      }
      await page.evaluate((item) => item.parentNode.removeChild(item), firstItem);
      await page.evaluate(() => window.scrollBy(0, 10));
      await page.waitForSelector(".js-stream-item");
      await page.waitForTimeout(2000);
    }
  }
};
```

위 1~6의 순서를 통해 아이프레임 정보를 가져올 수 있다.

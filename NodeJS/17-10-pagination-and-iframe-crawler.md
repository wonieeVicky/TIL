## 페이지네이션과 아이프레임 크롤링하기

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

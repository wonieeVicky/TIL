## 페이스북 크롤링 구현

### 페이스북 크롤링 준비

이번 시간에는 페이스북에 실전 크롤링을 적용해본다.
광고글이 아닌 피드에 좋아요를 누르고 원하는 정보를 수집해 저장하는 기능을 만들어보려고 한다.

`index.js`

기본 기능 구현을 위해 페이스북 로그인까지 구현한 기본 템플릿은 아래와 같다.

```jsx
const puppeteer = require("puppeteer");
const dotenv = require("dotenv");

const db = require("./models");
dotenv.config();

const crawler = async () => {
  try {
    await db.sequelize.sync();
    const browser = await puppeteer.launch({
      headless: false,
      args: ["--window-size=1920,1080", "--disable-notifications"],
    });
    const page = await browser.newPage();
    await page.setViewport({
      width: 1080,
      height: 1080,
    });
    await page.goto("https://facebook.com");
    await page.type("#email", process.env.EMAIL);
    await page.type("#pass", process.env.PASSWORD);
    await page.waitForTimeout(1000);
    await page.click("button[type=submit]");
    // login 된 시점을 체크
    await page.waitForResponse((response) => {
      return response.url().includes("login");
    });
    // 혹시 나타날 검은 배경화면 없어지도록 ESC 버튼 클릭
    await page.keyboard.press("Escape");
  } catch (e) {
    console.error(e);
  }
};

crawler();
```

### 페이스북 태그 분석

이제 첫번째 게시물 피드를 긁어오는 작업을 해본다.

`index.js`

```jsx
const puppeteer = require("puppeteer");
const dotenv = require("dotenv");

const db = require("./models");
dotenv.config();

const crawler = async () => {
  try {
    // ..

    await page.waitForSelector("[data-pagelet^=FeedUnit_]");
    const newPost = await page.evaluate(() => {
      const firstFeed = document.querySelector("[data-pagelet^=FeedUnit_]");
      const name =
        firstFeed.querySelector(".qzhwtbm6.knvmm38d h4") &&
        firstFeed.querySelector(".qzhwtbm6.knvmm38d h4").textContent;
      const content =
        firstFeed.querySelector("[data-ad-comet-preview=message]") &&
        firstFeed.querySelector("[data-ad-comet-preview=message]").textContent;
      const postId = firstFeed.dataset.pagelet.split("_").slice(-1)[0]; // 배열의 마지막 고르기
      return {
        name,
        content,
        postId,
      };
    });

    console.log(newPost);
  } catch (e) {
    console.error(e);
  }
};

crawler();

/*
{
  name: 'Erik Samakh님이 Île de Vassivière에 있습니다.',
  content: 'Île de Vassivière... Installation des flûtes solaires dans la neige...',
  postId: '0'
}
*/
```

배열의 마지막 원소를 가져오는 건 `.slice(-1)[0];` 으로 처리하며, 각종 클래스명은 수시로 바뀔 수 있으므로 그때 상황에 맞는 태그를 최적화해서 가져오는 것으로 한다!

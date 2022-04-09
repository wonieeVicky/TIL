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

### 이미지 태그, 좋아요, 광고글 분석 후 좋아요 요정되기

이미지 태그, 좋아요 태그, 광고글을 분석하는 것도 모두 위처럼 실제 페이스북 사이트에서 태그분석을 해서 동작을 시켜야 한다. 위 코드에 이어 이미지 태그를 newPost 변수에 담는 것과 광고글이 아닌 글에 좋아요를 눌러 좋아요 요정이 되보록 한다!

`index.js`

```jsx
// ..
const crawler = async () => {
  try {
    // ..
    await page.waitForSelector("[data-pagelet^=FeedUnit_]");
    const newPost = await page.evaluate(() => {
      const firstFeed = document.querySelector("[data-pagelet^=FeedUnit_]");
      // name, content, postId ..
      const img =
        firstFeed.querySelectorAll("img[class^=i09qtzwb]") && firstFeed.querySelectorAll("img[class^=i09qtzwb]").src;
      return {
        name,
        img,
        content,
        postId,
      };
    });
    await page.waitForTimeout(1000);

    // 좋아요 요정되기
    const likeBtn = await page.$("[data-pagelet^=FeedUnit_]:first-child ._666k a");
    await page.evaluate((like) => {
      const sponsor = document.querySelector("").textContent.includes("광고=============");
      if (like.getAttribute("aria-pressed") === "false" && !sponsor) {
        like.click(); // aria-pressed 속성이 false이고 광고글이 아니면 좋아요를 누른다.
      } else if (like.getAttribute("aria-pressed") === "false" && sponsor) {
        like.click(); // 광고글에 좋아요 누른 경우 좋아요를 취소한다.
      }
    }, likeBtn);
    await page.waitForTimeout(1000);

    // 크롤러 동작이 완료되면 해당 피드 삭제
    await page.evaluate(() => {
      const firstFeed = document.querySelector("[data-pagelet^=FeedUnit_]:first-child");
      firstFeed.parentNode.removeChild(firstFeed);
    });
    await page.waitForTimeout(1000);
  } catch (e) {
    console.error(e);
  }
};

crawler();
```

페이스북의 경우 크롤링 등을 막기 위해 각종 태그 구조와 클래스명이 수시로 변하고, textContent도 순수 텍스트가 아닌 형태로 반환되므로, 그때그때 특징에 맞게 크롤러를 커스텀하여 사용해야 한다.

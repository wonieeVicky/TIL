## 인스타그램 크롤링 구현

이번 시간에는 인스타그램 크롤링을 하면서 기존의 반복적인 코드를 좀 더 효율적으로 변경해본다 🥸

### waitForNavigation

먼저, 인스타그램에 로그인 하기 위해서는 페이스북 로그인을 해야한다.
이때 [페이스북 로그인] 버튼을 누르면 `facebook.com`로 페이지 이동이 발생하는데 이러한 페이지 전환을 크롤러에서도 기다려줘야 한다. 이 때 사용하는 메서드가 `waitForNavigation`이다.

`index.js`

```jsx
const puppeteer = require("puppeteer");
const dotenv = require("dotenv");

const crawler = async () => {
  try {
    // ..
    await page.goto("https://instagram.com");
    await page.waitForSelector("button:not([type=submit])"); // facebook으로 로그인 버튼 클릭
    await page.click("button:not([type=submit])");
    await page.waitForNavigation(); // facebook 로그인으로 넘어가는 것을 기다린다.

    await page.waitForSelector("#email");
    await page.type("#email", process.env.EMAIL);
    await page.type("#pass", process.env.PASSWORD);
    await page.waitForTimeout(1000);
    await page.waitForSelector("button[type=submit]");
    await page.click("button[type=submit]");
    await page.waitForNavigation(); // instagram으로 넘어가는 것을 기다린다.

    // ..
  } catch (e) {
    console.error(e);
  }
};
```

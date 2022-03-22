## 크롤러로 페이지 상호작용하기 - 페이스북 로그인 & 로그아웃

### 페이스북 로그인 태그 분석

이전 수업까지는 페이지에 방문해서 스크롤 이벤트를 하는 등으로 간단한 정보를 가져오는 심플한 크롤링을 진행해보았다. 이번에는 로그인, 로그아웃을 크롤러로 구현해보면서 사이트 상호작용에 대해 배워보고자 함

상호작용은 input에 정보를 입력하고, 키보드 입력이나 마우스 핸들링, 버튼 클릭 등의 행위를 모두 포함한다.
이런 사이트 상호작용이 어려운 페이지가 회원가입 페이지이다. 보통 회원가입 페이지에는 recapcha(사람인지 판단하는 프로그램)가 실행되어 크롤러가 회원가입하는 것을 막기 때문. 무조건 안되는 건 아니고 headless를 true로 했을 때 안 뜨는 경우도 있으니 테스트 해보면 된다.

먼저 지금까지 배웠던 것으로 페이스북 로그인을 시도해보자

`index.js`

```jsx
const puppeteer = require("puppeteer");

const crawler = async () => {
  try {
    const browser = await puppeteer.launch({ headless: false, args: ["--window-size=1920,1080"] });
    const page = await browser.newPage();
    await page.setViewport({
      width: 1080,
      height: 1080,
    });
    await page.goto("https://facebook.com");
    await page.evaluate(() => {
      document.querySelector("#email").value = "chw_326@hanmail.net";
      document.querySelector("#pass").value = "1234";
      document.querySelector("button[type=submit]").click();
    });
    // await page.close();
    // await browser.close();
  } catch (e) {
    console.error(e);
  }
};

crawler();
```

위처럼하면 실제 크롤러가 페이스북에 로그인을 시도하는 것을 확인할 수 있다.

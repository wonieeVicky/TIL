## 프록시로 서버 속이기

### 프록시 설명과 태그 분석

페이스북 같은 곳이 클라우드 IP를 차단하는 경우가 많이 생긴다. 이를 프록시를 통해 우회할 수 있다.
[프록시사이트](https://spys.one/free-proxy-list/KR/)에서 무료로 사용할 수 있는 가장 빠른 프록시 서버 IP를 가져와 크롤러에 적용하는 방법이다.

![다양한 프록시 IP를 볼 수 있음](../img/220330-1.png)

다양한 프록시 IP를 볼 수 있음

단, IP만 바꾼다고 해서 익명성이 항상 보장되지는 않는다. `anonymily`가 `NOA`인 경우 내가 누구인지 그대로 드러남. `HIA`나 `ANM`을 쓰면 익명성이 보장됨 참고하자!

이제 위 사이트에서 IP 주소와 Proxy type, latency 정보를 크롤러 내로 가져와야 한다. 태그 분석은 크롤링의 가장 기본이자 핵심이므로 개발자 도구에서 원하는 정보만 추출할 수 있는 방법을 찾은 뒤 코드에 추가해보면 된다.

`index.js`

```jsx
const puppeteer = require("puppeteer");
const dotenv = require("dotenv");
dotenv.config();

const crawler = async () => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      args: ["--window-size=1920,1080", "--disable-notifications"],
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1080 });

    // proxy 사이트 이동
    await page.goto("https://spys.one/free-proxy-list/KR/");
    const proxies = await page.evaluate(() => {
      // 원하는 태그 가져온다.
      document.querySelectorAll("tr > td:first-of-type > .spy14"); // IP
      Array.from(document.querySelectorAll("tr > td:nth-of-type(2)"))
        .slice(5)
        .map((v) => v.textContent); // Proxy type
      document.querySelectorAll("tr > td:nth-of-type(6) > .spy1"); // Latency 지연도
    });

    // ..
  } catch (e) {
    console.error(e);
  }
};

crawler();
```

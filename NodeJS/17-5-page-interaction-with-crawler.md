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

### dotenv로 비밀번호 관리

위 코드의 문제는 아이디와 비밀번호가 모두 코드 내에 들어있어 노출될 위험이 있다는 점이다. 이를 evaluate의 인자로 전달해주는 방식으로 비밀번호를 관리하는데 이를 dotenv로 관리해준다.

이를 위해서 먼저 dotenv 패키지를 설치해준다.

```bash
> npm i dotenv
```

이후 `.env` 파일을 생성하여 거기에 개인정보를 저장해준다. 이 파일은 서버 업로드 시 권한을 최상위로 두거나 깃에 푸시하지 않도록 하여 개인정보가 공유되지 않도록 관리를 잘해주어야 한다.

`.env`

```bash
EMAIL=chw_326@hanmail.net
PASSWORD=1234
```

`index.js`

```jsx
// ..
const dotenv = require("dotenv"); // dotenv 호출
dotenv.config(); // dotenv 실행

const crawler = async () => {
  try {
    // ..
    await page.goto("https://facebook.com");
    // process.env로 정보 호출
    const id = process.env.EMAIL;
    const password = process.env.PASSWORD;
    // evaluate 함수는 자바스크립트의 Scope를 따르지 않으므로 인자로 넘김
    await page.evaluate(
      (id, password) => {
        document.querySelector("#email").value = id;
        document.querySelector("#pass").value = password;
        document.querySelector("button[type=submit]").click();
      },
      id,
      password
    );
    // ..
  } catch (e) {
    console.error(e);
  }
};

crawler();
```

위와 같이 `dotenv.config();` 로 개인정보를 불러와준 뒤 id, password를 담는 부분에서 `process.env` 환경 변수로 id, password 값을 가져올 수 있다.

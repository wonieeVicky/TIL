## 인피니트 스크롤링 크롤링

### 인피니트 스크롤링과 postman

이제 정적인 페이지가 아닌 사용자 인터랙션이 들어가는 페이지([unsplash.com](https://unsplash.com/))에 크롤링을 구현해보고자 한다.
이번에는 인피니트 스크롤링 페이지를 크롤링하며 postman을 사용해서 처리한다.

`postman`은 서버로 요청을 보낼 때 쓰는 패키지로 GET,POST 등의 각 종 요청을 손쉽게 처리할 수 있다.
또 `postman`은 `preview` 기능이 있어 다운받은 소스를 미리보기로 바로 확인할 수 있는데, 이 `preview` 기능으로 보는 화면이 실제 크롤러가 보는 화면일 가능성이 높다.

만약 크롤링을 한 사이트가 spa 구조일 경우 필요한 여러 정보들을 csr(client side rendering)로 받아오므로, 실제 preview해서 보면 원하는 이미지나 필요한 정보가 담겨있지 않은 상태로 응답을 받게된다. 따라서 별도의 요청으로 소스를 받아와야 하므로 여러 절차가 추가되어야 함(즉, axios나 cheerio로 구현은 어렵다)

이제 크롤링 소스를 구현해본다. 기존의 모든 코드는 삭제하고 가장 기본적인 구조만 남긴다.
(즉 모든 크롤링은 아래 코드에서부터 시작한다.)

`index.js`

```jsx
const fs = require("fs");
const axios = require("axios");
const puppeteer = require("puppeteer");

const crawler = async () => {
  try {
    // code start !
  } catch (e) {
    console.error(e);
  }
};

crawler();
```

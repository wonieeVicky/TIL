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

### userDataDir로 로그인 유지하기

보통 페이스북이나 인스타그램에 로그인을 1회 진행하면 쿠키가 심겨 사이트 재방문 시 로그인 상태가 유지된다. 웹 크롤링 시에도 같은 컴퓨터로 계속 진행한다면 동일하게 로그인을 다시 하지 않는 것이 효율적이므로 `userDataDir`메서드로 로그인 유지를 구현해본다.

먼저 사용하고 있는 pc에 크롬 쿠키가 저장된 위치를 찾아야함. 나의 경우 mac이므로 구글링을 해서 위치를 찾았음 `/Users/vicky/Library/Application Support/Google/Chrome/Default`

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
			// userDataDir로 쿠키 연결
      userDataDir: "/Users/uneedcomms/Library/Application Support/Google/Chrome/Default", // login 쿠키 삽입
    });
    const page = await browser.newPage();
    // ..
  }
};
```

위와 같이 `userDataDir` 속성에 로그인 정보를 연결해주면 최초 1회 로그인 후 재접속 시 자동으로 로그인이 처리되는 것을 확인할 수 있다. 하지만, 콘솔창에 아래와 같은 에러가 뜬다.

```jsx
Error: Navigation failed because browser has disconnected!
    at /Users/vicky/study/TIL/NodeJS/lecture/nodejs-crawler/1-csv-parsing-example/node_modules/puppeteer/lib/cjs/puppeteer/common/LifecycleWatcher.js:51:147
    at /Users/vicky/study/TIL/NodeJS/lecture/nodejs-crawler/1-csv-parsing-example/node_modules/puppeteer/lib/cjs/vendor/mitt/src/index.js:51:62
    at Array.map (<anonymous>)
    at Object.emit (/Users/vicky/study/TIL/NodeJS/lecture/nodejs-crawler/1-csv-parsing-example/node_modules/puppeteer/lib/cjs/vendor/mitt/src/index.js:51:43)
```

이유는 기존의 `await page.waitForSelector("button:not([type=submit])");`로 기다려줬던 로그인 버튼이 바로 로그인이 되면서 기존의 코드에서 에러가 발생하는 것임.
따라서 분기처리를 해주어야 하는데 이 또한 태그 분석으로 로그인 여부를 판단해야 한다.

`index.js`

```jsx
// ..
const crawler = async () => {
  try {
		const browser = await puppeteer.launch({
      headless: false,
      args: ["--window-size=1920,1080", "--disable-notifications"],
      userDataDir: "/Users/vicky/Library/Application Support/Google/Chrome/Default", // login 쿠키 삽입
    });
		// ..

    // 로그인 여부 확인하는 분기처리 추가
    if (!(await page.waitForSelector('a[href = "/woniee_j/"]'))) {
      await page.waitForSelector("button:not([type=submit])");
      await page.click("button:not([type=submit])");
      await page.waitForNavigation();

      await page.waitForSelector("#email");
      await page.type("#email", process.env.EMAIL);
      await page.type("#pass", process.env.PASSWORD);

      await page.waitForTimeout(1000);
      await page.waitForSelector("#loginbutton");
      await page.click("#loginbutton");
      await page.waitForNavigation();
    }
  }
};
```

위처럼 `await page.waitForSelector('a[href = "/woniee_j/"]')` 로 로그인 여부를 체크해서 바로 로그인이 진행되지 않았을 경우에만 로그인 로직을 타도록 코드를 수정해주면 에러 발생이 없어진다.

### 인스타그램 virtualized list 에서 게시글 정보 가져오기

먼저 첫번째 게시글의 정보부터 태그분석을 통해 가져와본다.  
인스타그램은 virtualized list를 사용하기 때문에 스크롤 시 게시글을 삭제하거나 하는 동작을 하지 않아도 된다.
(스크롤에 따라 앞선 게시글을 알아서 삭제하여 총 8개의 게시글만 보여주는 구조를 사용)

`index.js`

```jsx
// ..
const crawler = async () => {
  try {
    // login..
    const newPost = await page.evaluate(() => {
      const article = document.querySelector("article:first-child");
      const postId =
        article.querySelector("time").parentElement.parentElement &&
        article.querySelector("time").parentElement.parentElement.href;
      const name = article.querySelector("span a[href]").textContent;
      const img = article.querySelector('img[class="FFVAD"]') && article.querySelector('img[class="FFVAD"]').src;
      const content = article.querySelector('div[data-testid="post-comment-root"] > span:last-child').textContent;
      return {
        postId,
        name,
        img,
        content,
      };
    });
  }
};

/*
newPost: {
  postId: 'https://www.instagram.com/p/CcUZiMfveob/',
  name: 'ju_y89',
  img: 'https://scontent-ssn1-1.cdninstagram.com/v/t51.2885-15/278499377_841758966737582_7403714858079806771_n.jpg?stp=dst-jpg_e35&_nc_ht=scontent-ssn1-1.cdninstagram.com&_nc_cat=102&_nc_ohc=1US4YiVBUyMAX9GJrb3&edm=AIQHJ4wBAAAA&ccb=7-4&ig_cache_key=MjgxNTk4Nzk2MTA0Mjk3NjE5MQ%3D%3D.2-ccb7-4&oh=00_AT8GBZAvEntFT5Ydf4m60DXKcdnRiyyj9YNdeX0kaJLOsQ&oe=62624294&_nc_sid=7b02f1',
  content: '.... 더 보기'
}
*/
```

위와 같이 동작 시키면 첫번째 게시글에 대한 정보가 잘 담기는 것을 확인할 수 있다.

### 더보기 버튼 및 반복 크롤링

우선 게시글에 content 부분이 더보기가 눌려지지 않아 제대로 긁어오지 못하는 이슈가 있다. 이를 개선!

`index.js`

```jsx
// ..
const crawler = async () => {
  try {
		// 더보기 버튼이 있으면 클릭한다.
    const moreButton = await page.$('article div[data-testid="post-comment-root"] span > div[role="button"] > div');
    if (moreButton) {
      await page.evaluate((btn) => btn.click(), moreButton);
    }

    const newPost = await page.evaluate(() => {
      // ..
    });
  }
};

/*
newPost: {
  postId: 'https://www.instagram.com/p/CcZm-WsLZQE/',
  name: 'jangsk83',
  img: 'https://scontent-ssn1-1.cdninstagram.com/v/t51.2885-15/278505321_1450598245356624_6891368153385308823_n.webp?stp=dst-jpg_e35&_nc_ht=scontent-ssn1-1.cdninstagram.com&_nc_cat=100&_nc_ohc=S8ep8WXnC40AX9QFpZB&edm=AIQHJ4wBAAAA&ccb=7-4&ig_cache_key=MjgxNzQ1NDQ0OTQwNTg0MDg5OQ%3D%3D.2-ccb7-4&oh=00_AT_1SFmDxdRJ1GTY6O483scSOf7lyzQoeQfOFz-qoXbzbA&oe=62625FC0&_nc_sid=7b02f1',
  content: '지코 삼촌을 좋아하는 예준#지코 #준코'
}
*/
```

태그 분석을 통해 더보기 버튼 태그를 긁어와서 해당 엘리먼트가 있으면 모두 클릭해주도록 코드를 추가했다.

다음으로는 while문을 이용해 10개의 게시글을 반복해서 가져오는 부분을 구현해본다.

`index.js`

```jsx
//..

const crawler = async () => {
  try {
    // login..
    let result = [];
    let prevPostId = "";
    while (result.length < 10) {
      const moreButton = await page.$('article div[data-testid="post-comment-root"] span > div[role="button"] > div');
      if (moreButton) {
        await page.evaluate((btn) => btn.click(), moreButton);
      }
      const newPost = await page.evaluate(() => {
        // ..
      });
      // 중복되지 않은 게시글만 추가
      if (newPost.postId !== prevPostId) {
        console.log("newPost:", newPost);
        // result에 없는 게시글만 넣어준다.
        if (!result.find((v) => v.postId === newPost.postId)) {
          result.push(newPost);
        }
      }
      prevPostId = newPost.postId; // prevPostId 업데이트
      await page.waitForTimeout(500);
      await page.evaluate(() => {
        window.scrollBy(0, 800); // scroll down
      });
    }
  } catch (e) {
    console.error(e);
  }
};

crawler();
```

담기는 게시글이 중복되지 않도록 prevPostId 변수를 생성하여 다음 게시글로 넘어가기 전 계속 업데이트해주었다. 위처럼 10개의 글을 긁어오도록 스크롤다운 처리하면 virtual DOM에서도 충분히 게시글을 가져올 수 있다.

### 인스타 하트 클릭과 DB 저장

인스타 하트 클릭과 DB 저장을 구현해본다.

`index.js`

```jsx
const db = require("./models");

const crawler = async () => {
  try {
    await db.sequelize.sync(); // db.sequelize 활성화
    // login..
    let result = [];
    let prevPostId = "";
    while (result.length < 10) {
      const moreButton = await page.$('article div[data-testid="post-comment-root"] span > div[role="button"] > div');
      if (moreButton) {
        await page.evaluate((btn) => btn.click(), moreButton);
      }
      const newPost = await page.evaluate(() => {
        const article = document.querySelector("article:first-child");
        // postId 뒷부분만 잘라내기
        const postId =
          article.querySelector("time").parentElement.parentElement &&
          article.querySelector("time").parentElement.parentElement.href.split("/").slice(-2, -1)[0];
        // ..

        return {
          postId,
          name,
          img,
          content,
        };
      });

      if (newPost.postId !== prevPostId) {
        if (!result.find((v) => v.postId === newPost.postId)) {
          // db에 존재하지 않으면 저장한다.
          const exist = await db.Instagram.findOne({ where: { postId: newPost.postId } });
          if (!exist) {
            result.push(newPost);
          }
        }
      }

      // 좋아요 구현
      await page.evaluate(() => {
        const article = document.querySelector("article:first-child");
        const heartBtn = article.querySelector('svg[aria-label="좋아요"][height="24"]');
        if (heartBtn) {
          heartBtn.parentElement.click();
        }
      });

      prevPostId = newPost.postId;
      await page.waitForTimeout(500);
      await page.evaluate(() => {
        window.scrollBy(0, 800);
      });
    }

    // DB 저장
    await Promise.all(
      result.map((r) => {
        return db.Instagram.create({
          postId: r.postId,
          media: r.img,
          writer: r.name,
          content: r.content,
        });
      })
    );
  } catch (e) {
    console.error(e);
  }
};

crawler();
```

위처럼 좋아요 클릭 구현과 게시글 db 저장 기능까지 코드를 추가해본다.
db 저장할 instagram db model은 아래와 같이 설정해준다.

`models/instagram.js`

```jsx
module.exports = (sequelize, Sequelize) => {
  return sequelize.define("instagram", {
    postId: {
      type: Sequelize.STRING(80),
      allowNull: false,
      unique: true,
    },
    media: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    content: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    writer: {
      type: Sequelize.STRING(30),
      allowNull: false,
    },
  });
};
```

`models/index.js`

```jsx
// ..
db.Proxy = require("./proxy")(sequelize, Sequelize);
db.Facebook = require("./facebook")(sequelize, Sequelize);
db.Instagram = require("./instagram")(sequelize, Sequelize);

// ..
```

### 인스타그램 검색

이번에는 간단하게 인스타그램 검색을 구현해본다.
인스타그램은 페이스북과 달리 엘리먼트 사용이 정확한 편이라 태그 분석 및 활용이 그나마 자유로운 편임.
이를 활용해서 여러가지 크롤링을 해볼 수도 있겠다!

`search.js`

```jsx
const crawler = async () => {
  try {
    // login..

    await page.waitForSelector('input[aria-label="입력 검색"]');
    await page.click('input[aria-label="입력 검색"]');
    await page.keyboard.type("맛집");
    await page.waitForSelector(".fuqBx");
    await page.waitForTimeout(2000); // 관련 검색어 가져오는데 시간 필요
    const href = await page.evaluate(() => {
      return document.querySelector(".fuqBx a:first-child").href;
    });
    await page.goto(href); // 페이지 이동

    // ..
  } catch (e) {
    console.error(e);
  }
};

crawler();
```

위처럼 처리하면 원하는 검색어에 담겨있는 정보를 크롤링할 수 있음!

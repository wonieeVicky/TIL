const puppeteer = require("puppeteer");
const dotenv = require("dotenv");

// const db = require("./models");
dotenv.config();

const crawler = async () => {
  try {
    // await db.sequelize.sync();
    const browser = await puppeteer.launch({
      headless: false,
      args: ["--window-size=1920,1080", "--disable-notifications"],
      userDataDir: "/Users/uneedcomms/Library/Application Support/Google/Chrome/Default", // login 쿠키 삽입
    });
    const page = await browser.newPage();
    await page.setViewport({
      width: 1080,
      height: 1080,
    });
    await page.goto("https://instagram.com");
    // 로그인 여부 확인하는 분기처리 추가
    if (!(await page.waitForSelector('a[href = "/woniee_j/"]'))) {
      await page.waitForSelector("button:not([type=submit])"); // facebook으로 로그인
      await page.click("button:not([type=submit])");
      await page.waitForNavigation(); // facebook 로그인으로 넘어가는 것을 기다린다.

      await page.waitForSelector("#email");
      await page.type("#email", process.env.EMAIL);
      await page.type("#pass", process.env.PASSWORD);
      await page.waitForTimeout(1000);
      await page.waitForSelector("#loginbutton");
      await page.click("#loginbutton");
      await page.waitForNavigation(); // instagram으로 넘어가는 것을 기다린다.
    }
    let result = [];
    let prevPostId = "";
    while (result.length < 10) {
      // 더보기 버튼이 있으면 클릭한다.
      // prettier-ignore
      const moreButton = await page.$('article div[data-testid="post-comment-root"] span > div[role="button"] > div');
      if (moreButton) {
        await page.evaluate((btn) => btn.click(), moreButton);
      }
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
      // 중복되지 않은 게시글만 추가하기
      if (newPost.postId !== prevPostId) {
        console.log("newPost:", newPost);
        // result에 없는 아이들만 넣어준다.
        if (!result.find((v) => v.postId === newPost.postId)) {
          result.push(newPost);
        }
      }
      prevPostId = newPost.postId;
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

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
    console.log("newPost:", newPost);
  } catch (e) {
    console.error(e);
  }
};

crawler();

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

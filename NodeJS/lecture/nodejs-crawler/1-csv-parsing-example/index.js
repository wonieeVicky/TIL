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
    await page.waitForResponse((response) => {
      // login 시점 체크
      return response.url().includes("login");
    });
    // 혹시 나타날 검은 배경화면 없어지도록 ESC 버튼 클릭
    await page.keyboard.press("Escape");

    // 게시글 만들기 클릭
    await page.waitForSelector("textarea");
    await page.click("textarea");
    await page.waitForSelector("._5rpb > div");
    await page.click("._5rpb > div");
    await page.waitForTimeout(1000);
    await page.keyboard.type("인간지능 크롤러봇 동작중 ...");
    await page.waitForTimeout(2000);
    await page.waitForSelector(".6c0o button[type=submit]");
    await page.click(".6c0o button[type=submit]");
  } catch (e) {
    console.error(e);
  }
};

crawler();

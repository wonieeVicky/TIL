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
  } catch (e) {
    console.error(e);
  }
};

crawler();

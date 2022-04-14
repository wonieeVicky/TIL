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
    await page.goto("https://instagram.com");
    await page.waitForSelector("button:not([type=submit])"); // facebook으로 로그인
    await page.click("button:not([type=submit])");
    await page.waitForNavigation(); // facebook 로그인으로 넘어가는 것을 기다린다.

    await page.waitForSelector("#email");
    await page.type("#email", process.env.EMAIL);
    await page.type("#pass", process.env.PASSWORD);
    await page.waitForTimeout(1000);
    await page.waitForSelector("button[type=submit]");
    await page.click("button[type=submit]");
    await page.waitForNavigation(); // instagram으로 넘어가는 것을 기다린다.

    // await page.waitForResponse((response) => {
    //   // login 시점 체크
    //   return response.url().includes("login");
    // });
    // // 혹시 나타날 검은 배경화면 없어지도록 ESC 버튼 클릭
    // await page.keyboard.press("Escape");

    // 페이지 전환을 기다려줘야 한다.
  } catch (e) {
    console.error(e);
  }
};

crawler();

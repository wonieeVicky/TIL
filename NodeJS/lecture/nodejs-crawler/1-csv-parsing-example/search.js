const puppeteer = require("puppeteer");
const dotenv = require("dotenv");
dotenv.config();

const crawler = async () => {
  try {
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
      await page.waitForNavigation();
    }

    await page.waitForSelector('input[aria-label="입력 검색"]');
    await page.click('input[aria-label="입력 검색"]');
    await page.keyboard.type("맛집");
    await page.waitForSelector(".fuqBx");
    await page.waitForTimeout(2000);
    const href = await page.evaluate(() => {
      return document.querySelector(".fuqBx a:first-child").href;
    });
    await page.goto(href);
    await page.close();
    await browser.close();
  } catch (e) {
    console.error(e);
  }
};

crawler();

const puppeteer = require("puppeteer");
const dotenv = require("dotenv");

// const db = require("./models");
dotenv.config();

const crawler = async () => {
  try {
    // await db.sequelize.sync();
    // const browserFetcher = puppeteer.createBrowserFetcher(); // 브라우저 가져오기
    // const revisionInfo = await browserFetcher.download("995683"); // 버전정보 가져오기
    const browser = await puppeteer.launch({
      headless: false,
      // executablePath: revisionInfo.executablePath, // 995683 version 브라우저가 실행됨
      args: ["--window-size=1920,1080", "--disable-notifications"],
      // userDataDir: "/Users/uneedcomms/Library/Application Support/Google/Chrome/Default", // login 쿠키 삽입
    });
    const page = await browser.newPage();
    await page.setViewport({
      width: 1080,
      height: 1080,
    });
    await page.goto("https://youtube.com");

    // await page.close();
    // await browser.close();
  } catch (e) {
    console.error(e);
  }
};

crawler();

const puppeteer = require("puppeteer");
const dotenv = require("dotenv");

// const db = require("./models");
dotenv.config();

const crawler = async () => {
  try {
    // await db.sequelize.sync();
    const browserFetcher = puppeteer.createBrowserFetcher(); // 브라우저 가져오기
    const revisionInfo = await browserFetcher.download("995683"); // 버전정보 가져오기
    const browser = await puppeteer.launch({
      headless: false,
      executablePath: revisionInfo.executablePath, // 995683 version 브라우저가 실행됨
      args: ["--window-size=1920,1080", "--disable-notifications"],
      userDataDir: "/Users/uneedcomms/Library/Application Support/Google/Chrome/Default", // login 쿠키 삽입 - 첫 시도는 직접 로그인
    });
    const page = await browser.newPage();
    await page.setViewport({
      width: 1080,
      height: 1080,
    });
    // 네트워크 로딩 후 작업 시작
    await page.goto("https://youtube.com", { waitUntil: "networkidle0" });

    if (!(await page.$("#avatar-btn"))) {
      // 로그인 시도
      await page.waitForSelector("#buttons ytd-button-renderer:last-child a");
      await page.click("#buttons ytd-button-renderer:last-child a");
      await page.waitForNavigation({ waitUntil: "networkidle2" });

      await page.waitForSelector("#identifierId");
      await page.type("#identifierId", process.env.EMAIL); // email type
      await page.waitForSelector("#identifierNext");
      await page.click("#identifierNext"); // 다음 창

      await page.waitForSelector('input[type="password"]');
      // await page.type('input[type="password"]', process.env.PASSWORD);
      await page.evaluate((password) => {
        document.querySelector('input[type="password"]').value = password;
      }, process.env.PASSWORD);

      await page.waitForTimeout(3000);
      await page.waitForSelector("#passwordNext");
      await page.click("#passwordNext"); // 다음 창

      await page.waitForNavigation({ waitUntil: "networkidle2" });
    } else {
      console.log("이미 로그인 됨");
    }

    // await page.close();
    // await browser.close();
  } catch (e) {
    console.error(e);
  }
};

crawler();

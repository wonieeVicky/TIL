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
    await page.goto("https://youtube.com", {
      // page 전환되자마자 이벤트 실행되지 않도록 모든 이벤트를 기다리도록 커스텀
      // 유튜브 동영상 로딩할 때에는 networkidle0을 쓰면 안된다.
      waitUntil: "networkidle0", // 모든 네트워크가 다 호출되었을 때 실행, domcontentloaded 돔 호출 완료 시
    });

    await page.waitForSelector("#buttons ytd-button-renderer:last-child a");
    await page.click("#buttons ytd-button-renderer:last-child a");
    await page.waitForNavigation({
      waitUntil: "networkidle2", // 2개정도의 네트워크는 마무리되지 않아도 실행하겠다.
    });

    // await page.close();
    // await browser.close();
  } catch (e) {
    console.error(e);
  }
};

crawler();

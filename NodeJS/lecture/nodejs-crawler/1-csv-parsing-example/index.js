const puppeteer = require("puppeteer");
const dotenv = require("dotenv");
dotenv.config();

const crawler = async () => {
  try {
    // prettier-ignore
    const browser = await puppeteer.launch({ headless: false,args: ["--window-size=1920,1080", "--disable-notifications"] });
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1080 });
    await page.goto("https://spys.one/free-proxy-list/KR/");
    const proxies = await page.evaluate(() => {
      document.querySelectorAll("tr > td:first-of-type > .spy14"); // IP
      // prettier-ignore
      Array.from(document.querySelectorAll("tr > td:nth-of-type(2)")).slice(5).map((v) => v.textContent); // Proxy type
      document.querySelectorAll("tr > td:nth-of-type(6) > .spy1"); // Latency 지연도
    });
    await page.close();
    await browser.close();
  } catch (e) {
    console.error(e);
  }
};

crawler();

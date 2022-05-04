const puppeteer = require("puppeteer");
const dotenv = require("dotenv");
dotenv.config();

const crawler = async () => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      args: ["--window-size=1920,1080", "--disable-notifications", "--no-sandbox"],
    });
    const page = await browser.newPage();
    await page.setViewport({
      width: 1080,
      height: 1080,
    });
    await page.goto("https://twitter.com", { waitUntil: "networkidle0" });
    await page.type(".LoginForm-username input", process.env.EMAIL);
    await page.type(".LoginForm-password input", process.env.PASSWORD);
    await page.waitForSelector('input[type="submit"]');
    await page.click('input[type="submit"]');
    await page.waitForNavigation();

    while (await page.$(".js-stream-item")) {
      const firstItem = await page.$(".js-stream-item:first-child");
      if (await page.$(".js-macaw-cards-iframe-container")) {
        await page.evaluate(() => {
          window.scrollBy(0, 10);
        });
        console.log("iframe 발견");
        await page.waitForResponse((response) => {
          console.log(response.url());
          return response.url().startsWith("https://twitter.com/i/cards/tfw/v1/");
        });
        await page.waitForSelector(".js-stream-item:first-child iframe");
        const iframe = await page.frames()[0];
        const result = await iframe.evaluate(() => {
          return {
            title: document.querySelector("h2") && document.querySelector("h2").textContent,
          };
        });
        console.log(result);
      } else {
        console.log("iframe 없음");
        await page.evaluate((item) => item.parentNode.removeChild(item), firstItem);
      }
    }
  } catch (e) {
    console.error(e);
  }
};

crawler();

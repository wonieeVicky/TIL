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
      if (await page.$(".js-stream-item:first-child .js-macaw-cards-iframe-container")) {
        const tweetId = await page.evaluate((item) => item.dataset.itemId, firstItem); // 찾고자하는 iframe id 가져오기
        await page.evaluate(() => window.scrollBy(0, 10)); // 스크롤을 살짝 내린다.
        await page.waitForSelector(".js-stream-item:first-child iframe"); // ㅑ
        const iframe = await page.frames().find((frame) => frame.url().includes(tweetId)); // 원하는 iframe 가져오기
        if (iframe) {
          const result = await iframe.evaluate(() => ({
            title: document.querySelector("h2") && document.querySelector("h2").textContent,
          })); // iframe의 정보 가져오기
          console.log(result); // { title: '알리바바 미래호텔 모습' }
        }
      }
      await page.evaluate((item) => item.parentNode.removeChild(item), firstItem);
      await page.evaluate(() => window.scrollBy(0, 10)); // 스크롤을 살짝 내린다.
      await page.waitForSelector(".js-stream-item");
      await page.waitForTimeout(2000);
    }
  } catch (e) {
    console.error(e);
  }
};

crawler();

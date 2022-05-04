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
  } catch (e) {
    console.error(e);
  }
};

crawler();

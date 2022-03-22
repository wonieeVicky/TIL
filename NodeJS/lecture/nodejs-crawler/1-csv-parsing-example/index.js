const puppeteer = require("puppeteer");

const crawler = async () => {
  try {
    const browser = await puppeteer.launch({ headless: false, args: ["--window-size=1920,1080"] });
    const page = await browser.newPage();
    await page.setViewport({
      width: 1080,
      height: 1080,
    });
    await page.goto("https://facebook.com");
    await page.evaluate(() => {
      document.querySelector("#email").value = "chw_326@hanmail.net";
      document.querySelector("#pass").value = "1234";
      document.querySelector("button[type=submit]").click();
    });
    // await page.close();
    // await browser.close();
  } catch (e) {
    console.error(e);
  }
};

crawler();

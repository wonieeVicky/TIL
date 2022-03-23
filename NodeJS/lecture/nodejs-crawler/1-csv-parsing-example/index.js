const puppeteer = require("puppeteer");
const dotenv = require("dotenv");
dotenv.config();

const crawler = async () => {
  try {
    const browser = await puppeteer.launch({ headless: false, args: ["--window-size=1920,1080"] });
    const page = await browser.newPage();
    await page.setViewport({
      width: 1080,
      height: 1080,
    });
    await page.goto("https://facebook.com");
    const id = process.env.EMAIL;
    const password = process.env.PASSWORD;
    // evaluate 함수는 자바스크립트의 Scope를 따르지 않으므로 인자로 넘겨야 한다.
    await page.evaluate(
      (id, password) => {
        document.querySelector("#email").value = id;
        document.querySelector("#pass").value = password;
        document.querySelector("button[type=submit]").click();
      },
      id,
      password
    );
    // await page.close();
    // await browser.close();
  } catch (e) {
    console.error(e);
  }
};

crawler();

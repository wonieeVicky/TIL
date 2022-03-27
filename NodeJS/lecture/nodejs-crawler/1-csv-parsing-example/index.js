const puppeteer = require("puppeteer");
const dotenv = require("dotenv");
dotenv.config();

const crawler = async () => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      args: ["--window-size=1920,1080", "--disable-notifications"],
    });
    const page = await browser.newPage();
    await page.setViewport({
      width: 1080,
      height: 1080,
    });
    await page.goto("https://facebook.com");
    await page.type("#email", process.env.EMAIL); // email 입력
    await page.type("#pass", process.env.PASSWORD); // password 입력
    await page.hover("button[type=submit]"); // 버튼 위에 mouse hover
    await page.waitForTimeout(3000); // 3초 대기
    await page.click("button[type=submit]"); // submit!
    // await page.waitForTimeout(10000); // 10초 대기(로그인 후 화면 전환) - 네트워크에 따라 상황이 달라짐.
    // waitForRequest 요청 대기, waitForResponse 응답 대기
    await page.waitForResponse((response) => {
      console.log("1:", response, response.url());
      return response.url().includes("login");
    });
    // await page.keyboard.press("Escape"); // esc keypress

    // 로그아웃 구현
    await page.click("#userNavigationLabel");
    await page.waitForSelector("li.navSubmenu:last-child");
    await page.waitForTimeout(3000); // 3초 대기
    await page.click("li.navSubmenu:last-child");

    // await page.close();
    // await browser.close();
  } catch (e) {
    console.error(e);
  }
};

crawler();

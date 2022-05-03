﻿const puppeteer = require("puppeteer");

const crawler = async () => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      args: ["--window-size=1920,1080", "--disable-notifications", "--no-sandbox"],
    });
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36"
    );
    await page.setViewport({
      width: 1080,
      height: 1080,
    });
    const keyword = "crawler";
    await page.goto(`https://github.com/search?q=${keyword}`, {
      waitUntil: "networkidle0",
    });
    let result = [];
    let pageNum = 1;
    while (pageNum < 5) {
      const r = await page.evaluate(() => {
        const tags = document.querySelectorAll(".repo-list-item");
        const result = [];
        tags.forEach((t) => {
          result.push({
            name: t && t.querySelector("h3") && t.querySelector("h3").textContent.trim(),
            star: t && t.querySelector(".muted-link") && t.querySelector(".muted-link").textContent.trim(),
            lang:
              t &&
              t.querySelector(".text-gray.flex-auto") &&
              t.querySelector(".text-gray.flex-auto").textContent.trim(),
          });
        });
        return result;
      });

      result = result.concat(r);
      await page.waitForSelector(".next_page");
      await page.click(".next_page");
      pageNum++;

      // 다음 페이지의 응답이 완료될 때까지 기다려준다.
      await page.waitForResponse((response) => {
        return response.url().startsWith(`https://github.com/search/count?p=${pageNum}`) && response.status() === 200;
      });
      await page.waitForTimeout(2000);
    }
    console.log(result.length);
    console.log(result[0]);
  } catch (e) {
    console.error(e);
  }
};

crawler();

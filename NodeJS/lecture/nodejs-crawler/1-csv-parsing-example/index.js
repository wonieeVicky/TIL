﻿const puppeteer = require("puppeteer");

const crawler = async () => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      args: ["--window-size=1920,1080", "--disable-notifications", "--no-sandbox"],
    });
    let result = [];
    await Promise.all(
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(async (v) => {
        const page = await browser.newPage();
        await page.setViewport({
          width: 1080,
          height: 1080,
        });
        const keyword = "mouse";
        await page.goto(`https://www.amazon.com/s?k=${keyword}&page=${v}`, {
          waitUntil: "networkidle0",
        });

        const r = await page.evaluate(() => {
          const tags = document.querySelectorAll(".s-result-list > div");
          const result = [];
          tags.forEach((t) => {
            result.push({
              name: t && t.querySelector("h5") && t.querySelector("h5").textContent.trim(),
              price: t && t.querySelector(".a-offscreen") && t.querySelector(".a-offscreen").textContent,
            });
          });
          return result;
        });
        result = result.concat(r);
      })
    );

    console.log(result.length); // 220
    console.log(result[0]); // { name: 'S-Button Wired USB Optical Mouse..', price: '$8.99' }

    // await page.close();
    // await browser.close();
  } catch (e) {
    console.error(e);
  }
};

crawler();

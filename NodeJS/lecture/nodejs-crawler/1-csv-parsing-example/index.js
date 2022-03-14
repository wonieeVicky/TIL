const parse = require("csv-parse/lib/sync");
const { stringify } = require("csv-stringify/sync");
const fs = require("fs");
const puppeteer = require("puppeteer");

const csv = fs.readFileSync("csv/data.csv");
const records = parse(csv.toString("utf-8"));

const crawler = async () => {
  try {
    const result = [];
    const browser = await puppeteer.launch({ headless: process.env.NODE_ENV === "production" });
    await Promise.all(
      records.map(async (r, i) => {
        try {
          const page = await browser.newPage();
          await page.goto(r[1]);
          const scoreEl = await page.$(".score.score_left .star_score");
          if (scoreEl) {
            const text = await page.evaluate((tag) => tag.textContent, scoreEl);
            result[i] = [r[0], r[1], text.trim()]; // 순서 보장을 위해 result 배열의 인덱스로 정보를 저장
          }
          await page.waitForTimeout(3000);
          await page.close();
          const str = stringify(result);
          fs.writeFileSync("csv/result.csv", str);
        } catch (e) {
          console.error(e);
        }
      })
    );
    await browser.close(); // 브라우저 Close
  } catch (e) {
    console.error(e);
  }
};

crawler();

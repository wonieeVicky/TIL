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
          const text = await page.evaluate(() => {
            const score = document.querySelector(".score.score_left .star_score");
            if (score) {
              return score.textContent;
            }
          });
          result[i] = [r[0], r[1], text.trim()];
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

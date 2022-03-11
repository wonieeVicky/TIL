const parse = require("csv-parse/lib/sync");
const fs = require("fs");
const puppeteer = require("puppeteer");

const csv = fs.readFileSync("csv/data.csv");
const records = parse(csv.toString("utf-8"));

const crawler = async () => {
  const browser = await puppeteer.launch({ headless: process.env.NODE_ENV === "production" });
  const [page1, page2, page3] = await Promise.all([browser.newPage(), browser.newPage(), browser.newPage()]);
  await Promise.all([
    page1.goto("https://github.com/wonieeVicky"),
    page2.goto("https://www.naver.com"),
    page3.goto("https://www.google.com"),
  ]);
  await Promise.all([page1.waitForTimeout(3000), page2.waitForTimeout(500), page3.waitForTimeout(2000)]);
  await page1.close(); // 페이지 Close
  await page2.close(); // 페이지 Close
  await page3.close(); // 페이지 Close
  await browser.close(); // 브라우저 Close
};

crawler();

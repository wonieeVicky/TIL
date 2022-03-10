const parse = require("csv-parse/lib/sync");
const fs = require("fs");
const puppeteer = require("puppeteer");

const csv = fs.readFileSync("csv/data.csv");
const records = parse(csv.toString("utf-8"));

const crawler = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page1 = await browser.newPage();
  const page2 = await browser.newPage();
  const page3 = await browser.newPage();
  await page1.goto("https://github.com/wonieeVicky");
  await page2.goto("https://www.naver.com");
  await page3.goto("https://www.google.com");
  await page1.waitForTimeout(1000); // 3초 대기
  await page2.waitForTimeout(1000); // 1초 대기
  await page3.waitForTimeout(1000); // 1초 대기
  await page1.close(); // 페이지 Close
  await page2.close(); // 페이지 Close
  await page3.close(); // 페이지 Close
  await browser.close(); // 브라우저 Close
};

crawler();

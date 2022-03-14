const parse = require("csv-parse/lib/sync");
const fs = require("fs");
const puppeteer = require("puppeteer");

const csv = fs.readFileSync("csv/data.csv");
const records = parse(csv.toString("utf-8"));

const crawler = async () => {
  // try ~ catch는 async 함수 내부에서 사용하여 에러를 잡는다.
  try {
    const browser = await puppeteer.launch({ headless: process.env.NODE_ENV === "production" });
    await Promise.all(
      records.map(async (r, i) => {
        // 내부에 async 함수가 한번 더 사용되었으니 try ~ catch로 한번 더 감싸준다.
        try {
          const page = await browser.newPage(); // 동시에 페이지 10개가 열린다.
          await page.goto(r[1]); // 동시에 페이지에 방문한다.
          const scoreEl = await page.$(".score.score_left .star_score"); // 별점 엘리먼트로 이동
          if (scoreEl) {
            // 태그를 잘 찾았으면
            // evaluate 함수를 통해 찾은 태그로 textContent를 반환
            const text = await page.evaluate((tag) => tag.textContent, scoreEl); // 평점
            // console.log(r[0], "평점", text.trim());
          }
          await page.waitForTimeout(3000); // 웹크롤러 방지 코드에 걸리지 않도록 처리
          await page.close();
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

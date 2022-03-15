const puppeteer = require("puppeteer");
const add_to_sheet = require("./add_to_sheet");
const xlsx = require("xlsx"); // xlsx 패키지 호출
const workbook = xlsx.readFile("xlsx/data.xlsx");
const ws = workbook.Sheets.영화목록; // 조회할 시트 가져오기
const records = xlsx.utils.sheet_to_json(ws); // 시트를 json 형태로 변환

const crawler = async () => {
  try {
    const browser = await puppeteer.launch({ headless: process.env.NODE_ENV === "production" });
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36"
    );
    add_to_sheet(ws, "C1", "s", "평점"); // sheet에 평점 column 추가
    for (const [i, r] of records.entries()) {
      await page.goto(r.링크);
      const text = await page.evaluate(() => {
        const score = document.querySelector(".score.score_left .star_score");
        if (score) {
          return score.textContent;
        }
      });
      if (text) {
        console.log(r.제목, "평점: ", text.trim());
        const newCell = "C" + (i + 2);
        add_to_sheet(ws, newCell, "n", parseFloat(text.trim())); // sheet에 평점 row 추가
      }
      await page.waitForTimeout(3000);
    }
    await page.close();
    await browser.close();
    xlsx.writeFile(workbook, "xlsx/result.xlsx"); // xlsx 파일로 export
  } catch (e) {
    console.error(e);
  }
};

crawler();

const puppeteer = require("puppeteer");
const add_to_sheet = require("./add_to_sheet");
const xlsx = require("xlsx"); // xlsx 패키지 호출
const workbook = xlsx.readFile("xlsx/data.xlsx");
const ws = workbook.Sheets.영화목록; // 조회할 시트 가져오기
const records = xlsx.utils.sheet_to_json(ws); // 시트를 json 형태로 변환
const fs = require("fs");
const axios = require("axios");

fs.readdir("screenshot", (err) => {
  // screenshot 폴더가 있는지 확인 후 없으면 에러 - 기존 폴더가 있을 경우 충돌 에러 발생하므로
  if (err) {
    console.error("screenshot 폴더가 없어 screenshot 폴더를 생성한다.");
    fs.mkdirSync("screenshot"); // sync 메서드는 프로그램의 처음과 끝에만 사용하는 것이 좋음
  }
});
fs.readdir("poster", (err) => {
  // poster 폴더가 있는지 확인 후 없으면 에러 - 기존 폴더가 있을 경우 충돌 에러 발생하므로
  if (err) {
    console.error("poster 폴더가 없어 poster 폴더를 생성한다.");
    fs.mkdirSync("poster");
  }
});

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
      const result = await page.evaluate(() => {
        const scoreEl = document.querySelector(".score.score_left .star_score");
        let score = "";
        if (scoreEl) {
          score = scoreEl.textContent;
        }
        const imgEl = document.querySelector(".poster img");
        let img = "";
        if (imgEl) {
          img = imgEl.src;
        }
        return { score, img };
      });
      if (result.score) {
        console.log(r.제목, "평점: ", result.score.trim());
        const newCell = "C" + (i + 2);
        add_to_sheet(ws, newCell, "n", parseFloat(result.score.trim())); // sheet에 평점 row 추가
      }
      if (result.img) {
        // buffer가 연속적으로 들어있는 자료구조가 arraybuffer
        const imgResult = await axios.get(result.img.replace(/\?.+$/, ""), { responseType: "arraybuffer" });
        fs.writeFileSync(`poster/${r.제목}.jpg`, imgResult.data);
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

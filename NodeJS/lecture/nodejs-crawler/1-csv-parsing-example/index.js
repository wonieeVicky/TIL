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
    const browser = await puppeteer.launch({
      headless: process.env.NODE_ENV === "production",
      args: ["--window-size=1920,1080"], //  브라우저 사이즈 설정
    });
    const page = await browser.newPage();
    // 페이지 사이즈 설정
    await page.setViewport({
      width: 1920,
      height: 1080,
    });
    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36"
    );
    add_to_sheet(ws, "C1", "s", "평점");
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
        // 스크린샷 저장 구현
        // path 속성을 쓰면 저장 위치를 설정할 수 있다.
        // fullPage 옵션에 따라 전체 페이지를 스크린샷으로 찍을 수 있다.
        // clip 속성을 쓰면 원하는 위치만 스크린샷으로 찍을 수 있다. (왼쪽 상단 모서리 좌표(x, y), 너비(width), 높이(height) 값이 필요)
        await page.screenshot({
          path: `screenshot/${r.제목}.png`,
          clip: { x: 100, y: 100, width: 300, height: 300 },
        });
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

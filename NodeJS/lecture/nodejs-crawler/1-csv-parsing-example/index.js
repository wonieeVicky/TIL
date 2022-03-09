const xlsx = require("xlsx");
const axios = require("axios"); // ajax 라이브러리
const cheerio = require("cheerio"); // html 파싱
const add_to_sheet = require("./add_to_sheet");

const workbook = xlsx.readFile("xlsx/data.xlsx");
const ws = workbook.Sheets.영화목록;
const records = xlsx.utils.sheet_to_json(ws);

const crawler = async () => {
  add_to_sheet(ws, "C1", "s", "평점"); // C1에 평점 raw를 string 값을 넣는다.
  for (const [i, r] of records.entries()) {
    const response = await axios.get(r.링크);
    if (response.status === 200) {
      // 응답이 성공한 경우
      const html = response.data;
      const $ = cheerio.load(html);
      const text = $(".score.score_left .star_score").text();
      console.log(r.제목, "평점:", text.trim());
      const newCell = "C" + (i + 2);
      add_to_sheet(ws, newCell, "n", parseFloat(text.trim()));
    }
  }
  xlsx.writeFile(workbook, "xlsx/result.xlsx");
  // await Promise.all(records.map(async (r) => {}));
};

crawler();

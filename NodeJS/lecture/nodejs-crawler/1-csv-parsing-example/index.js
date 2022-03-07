const xlsx = require("xlsx");
const axios = require("axios"); // ajax 라이브러리
const cheerio = require("cheerio"); // html 파싱

const workbook = xlsx.readFile("xlsx/data.xlsx");
for (const name of workbook.SheetNames) {
  const ws = workbook.Sheets.name;
  // 시트별로 따로 코딩
}
ws["!ref"] = ws["!ref"]
  .split(":")
  .map((v, i) => (i === 0 ? "A2" : v))
  .join(":");
// 혹은 ws["!ref"] = 'A2:B11'로 직접 변경 가능 ㅋ

const records = xlsx.utils.sheet_to_json(ws, { header: "A" });
console.log(records);

/* const crawler = async () => {
  for (const [i, r] of records.entries()) {
    const response = await axios.get(r.링크);
    if (response.status === 200) {
      // 응답이 성공한 경우
      const html = response.data;
      const $ = cheerio.load(html);
      const text = $(".score.score_left .star_score").text();
      console.log(r.제목, "평점:", text.trim());
    }
  }
  await Promise.all(records.map(async (r) => {}));
};

crawler(); */

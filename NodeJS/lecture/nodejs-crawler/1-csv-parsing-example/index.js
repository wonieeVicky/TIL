const xlsx = require("xlsx");

const workbook = xlsx.readFile("xlsx/data.xlsx"); // readFile로 엑셀을 읽음

// console.log(Object.keys(workbook.Sheets)); // 영화목록
const ws = workbook.Sheets.영화목록;
const records = xlsx.utils.sheet_to_json(ws);

// 배열.entries를 쓰면 내부 배열이 [인덱스, 값]모양 이터레이터로 바뀜
for (const [i, r] of records.entries()) {
  console.log(i, r.제목, r.링크);
}

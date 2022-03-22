const fs = require("fs");
const axios = require("axios");
const puppeteer = require("puppeteer");

// imgs 폴더 생성
fs.readdir("imgs", (err) => {
  if (err) {
    console.error("imgs 폴더가 없어 imgs 폴더를 생성합니다.");
    fs.mkdirSync("imgs");
  }
});

const crawler = async () => {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto("https://unsplash.com");
    let result = [];
    // img srcs가 30개 모일 때까지 반복한다.
    while (result.length <= 5) {
      const srcs = await page.evaluate(() => {
        window.scrollTo(0, 0); // 절대 좌표
        let imgs = [];
        const imgEls = document.querySelectorAll("figure");
        if (imgEls.length) {
          imgEls.forEach((v) => {
            let src = v.querySelector("img.YVj9w")?.src;
            src && imgs.push(src);
            v.innerHTML = "";
          });
        }
        window.scrollBy(0, 100); // 상대 좌표: 현재의 위치에서 스크롤 100px 이동
        return imgs;
      });
      result = result.concat(srcs);
      await page.waitForSelector("figure");
    }
    console.log(result);
    result.forEach(async (src) => {
      const imgResult = await axios.get(src.replace(/\?.*$/, ""), {
        responseType: "arraybuffer",
      });
      fs.writeFileSync(`imgs/${new Date().valueOf()}.jpeg`, imgResult.data);
    });
    // 크롤링 결과를 파일로 만들기
    await page.close();
    await browser.close();
  } catch (e) {
    console.error(e);
  }
};

crawler();

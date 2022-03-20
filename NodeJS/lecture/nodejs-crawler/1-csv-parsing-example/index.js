const fs = require("fs");
const axios = require("axios");
const puppeteer = require("puppeteer");

const crawler = async () => {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto("https://unsplash.com");
    let result = [];
    // img srcs가 30개 모일 때까지 반복한다.
    while (result.length <= 30) {
      const srcs = await page.evaluate(() => {
        window.scrollTo(0, 0); // 절대 좌표
        let imgs = [];
        const imgEls = document.querySelectorAll(".ripi6");
        if (imgEls.length) {
          imgEls.forEach((v) => {
            let src = v.querySelector("img.YVj9w")?.src; // element가 있으면 src 담는다.
            src && imgs.push(src);
            v.innerHTML = ""; // imgEl 내부만 비워주는 방식으로 변경
            // v.parentElement.removeChild(v); // 동작 x, 실제 사이트에서 같은 방법으로 시도했을때 이미지 로드 불가
          });
        }
        window.scrollBy(0, 100); // 상대 좌표: 현재의 위치에서 스크롤 100px 이동
        return imgs;
      });
      result = result.concat(srcs);
      await page.waitForSelector(".ripi6");
      console.log("새 이미지 태그 로드 완료");
    }
    console.log(result);
    await page.close();
    await browser.close();
  } catch (e) {
    console.error(e);
  }
};

crawler();

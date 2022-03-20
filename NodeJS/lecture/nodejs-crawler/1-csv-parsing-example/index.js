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
        window.scrollTo(0, 0);
        let imgs = [];
        const imgEls = document.querySelectorAll(".ripi6");
        if (imgEls.length) {
          imgEls.forEach((v) => {
            let src = v.querySelector("img.YVj9w")?.src; // element가 있으면 src 담는다.
            src && imgs.push(src);
            v.innerHTML = "";
            // v.parentElement.removeChild(v); // 해당 엘리먼트(.ripi6)의 부모로 옮겨가서 엘리먼트를 지워준다.
          });
        }
        window.scrollBy(0, 100); // 세로로 300px 내려준다.
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

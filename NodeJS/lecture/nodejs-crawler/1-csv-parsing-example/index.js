const fs = require("fs");
const axios = require("axios");
const puppeteer = require("puppeteer");

const crawler = async () => {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto("https://unsplash.com");
    const result = await page.evaluate(() => {
      let imgs = [];
      const imgEls = document.querySelectorAll(".ripi6");
      if (imgEls.length) {
        imgEls.forEach((v) => {
          let src = v.querySelector("img.YVj9w").src;
          src && imgs.push(src);
          v.parentElement.removeChild(v); // 해당 엘리먼트(.ripi6)의 부모로 옮겨가서 엘리먼트를 지워준다.
        });
      }
      window.scrollBy(0, 100); // 세로로 100px 내려준다.
      return imgs;
    });
    console.log("result:", result);
    // waitForSelector는 특정 선택자를 기다릴 수 있다.
    // 단, 30초간 기다린 후 선택자를 못 찾으면 timeout 에러
    await page.waitForSelector(".ripi6");
    console.log("새 이미지 태그 로드 완료");
  } catch (e) {
    console.error(e);
  }
};

crawler();

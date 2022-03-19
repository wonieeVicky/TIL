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
      const imgEls = document.querySelectorAll(".ripi6 img.YVj9w");
      if (imgEls.length) {
        imgEls.forEach((v) => v.src && imgs.push(v.src));
      }
      return imgs;
    });
    console.log("result:", result);
  } catch (e) {
    console.error(e);
  }
};

crawler();
result: [
  "https://images.unsplash.com/photo-1640622842924-3ae860f77265?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxfHx8ZW58MHx8fHw%3D&w=1000&q=80",
  "https://images.unsplash.com/photo-1647533532539-ff164151cd89?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzfHx8ZW58MHx8fHw%3D&w=1000&q=80",
  "https://images.unsplash.com/photo-1647606472102-ca1959036bdf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw1fHx8ZW58MHx8fHw%3D&w=1000&q=80",
  "https://images.unsplash.com/photo-1638913661377-abd9e8cf1998?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHw2fHx8ZW58MHx8fHw%3D&w=1000&q=80",
  "https://images.unsplash.com/photo-1634072319894-107e61606191?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw4fHx8ZW58MHx8fHw%3D&w=1000&q=80",
  "https://images.unsplash.com/photo-1647610365194-662ed67a998e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMHx8fGVufDB8fHx8&w=1000&q=80",
];

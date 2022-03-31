const puppeteer = require("puppeteer");
const dotenv = require("dotenv");
dotenv.config();

const crawler = async () => {
  try {
    // prettier-ignore
    let browser = await puppeteer.launch({ headless: false, args: ["--window-size=1920,1080", "--disable-notifications"] });
    let page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1080 });
    await page.goto("https://spys.one/free-proxy-list/KR/");
    const proxies = await page.evaluate(() => {
      const ips = Array.from(document.querySelectorAll("tr > td:first-of-type > .spy14")).map((v) =>
        v.textContent.replace(/document\.write\(.+\)/, "")
      ); // IP
      // prettier-ignore
      const types = Array.from(document.querySelectorAll("tr > td:nth-of-type(2)")).slice(5).map((v) => v.textContent); // Proxy type
      const latencies = Array.from(document.querySelectorAll("tr > td:nth-of-type(6) > .spy1")).map(
        (v) => v.textContent
      ); // Latency 지연도
      return ips.map((v, i) => ({
        ip: v,
        type: types[i],
        latencies: latencies[i],
      }));
    });
    // type이 HTTP, HTTPS로 시작하고, latencies가 가장 작은, 즉 가장 빠른 ip를 찾는다.
    const filtered = proxies.filter((v) => v.type.startsWith("HTTPS")).sort((p, c) => p.latencies - c.latencies);
    console.log(filtered);
    await page.close();
    await browser.close();

    // 다시 브라우저를 킨다.
    browser = await puppeteer.launch({
      headless: false,
      args: [
        "--window-size=1920,1080",
        "--disable-notifications",
        `--proxy-server=${filtered[0].ip}`,
        "--ignore-certificate-errors",
        "--ignore-certificate-errors-spki-list ",
      ],
    });
    page = await browser.newPage();
    await page.goto("https://www.daum.com");
  } catch (e) {
    console.error(e);
  }
};

crawler();

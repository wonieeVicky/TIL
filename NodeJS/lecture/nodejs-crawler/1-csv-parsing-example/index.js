const puppeteer = require("puppeteer");
const dotenv = require("dotenv");

const db = require("./models");
dotenv.config();

const crawler = async () => {
  await db.sequelize.sync(); // db 연결
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
        latency: latencies[i],
      }));
    });
    // type이 HTTP, HTTPS로 시작하고, latencies가 가장 작은, 즉 가장 빠른 ip를 찾는다.
    const filtered = proxies.filter((v) => v.type.startsWith("HTTP")).sort((p, c) => p.latency - c.latency);
    // db Proxy에 프록시 정보 저장
    await Promise.all(
      filtered.map(async (v) => {
        return db.Proxy.create({
          ip: v.ip,
          type: v.type,
          latency: v.latency,
        });
      })
    );
    await page.close();
    await browser.close();

    // 가장 빠른 latency를 가져온다.
    const fastestProxy = await db.Proxy.findOne({
      order: [["latency", "ASC"]],
    });
    // 브라우저 restart
    console.log(`restart ip: ${fastestProxy.ip}`);
    browser = await puppeteer.launch({
      headless: false,
      args: [
        "--window-size=1920,1080",
        "--disable-notifications",
        `--proxy-server=${fastestProxy.ip}`,
        "--ignore-certificate-errors",
        "--ignore-certificate-errors-spki-list ",
      ],
    });
    page = await browser.newPage();
    await page.goto("https://whatismyipaddress.com/");
    await page.waitForTimeout(10000);
    await page.close();
    await browser.close();
    await db.sequelize.close(); // db connection 닫기
  } catch (e) {
    console.error(e);
  }
};

crawler();

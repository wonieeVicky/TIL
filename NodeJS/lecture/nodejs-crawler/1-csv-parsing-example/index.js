const puppeteer = require("puppeteer");
const dotenv = require("dotenv");
dotenv.config();

const crawler = async () => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      args: ["--window-size=1920,1080", "--disable-notifications"],
    });
    const page = await browser.newPage();
    await page.setViewport({
      width: 1080,
      height: 1080,
    });

    page.on("dialog", async (dialog) => {
      console.log(dialog.type(), dialog.message());
      await dialog.accept("https://github.com/wonieeVicky");
    });

    await page.evaluate(() => {
      const data = prompt("주소를 입력하세요");
      location.href = data;
    });

    await page.goto("https://facebook.com");
    await page.type("#email", process.env.EMAIL); // email 입력
    await page.type("#pass", process.env.PASSWORD); // password 입력
    await page.hover("button[type=submit]"); // 버튼 위에 mouse hover
    await page.waitForTimeout(3000);
    await page.click("button[type=submit]"); // login submit!

    // waitForRequest 요청 대기, waitForResponse 응답 대기
    await page.waitForResponse((response) => {
      return response.url().includes("login");
    });
    await page.waitForTimeout(1000);
    await page.keyboard.press("Escape"); // esc keypress
    await page.waitForTimeout(1000);

    await page.evaluate(() => {
      (() => {
        const box = document.createElement("div");
        box.classList.add("mouse-helper");
        const styleElement = document.createElement("style");
        styleElement.innerHTML = `
          .mouse-helper {
            pointer-events: none;
            position: absolute;
            z-index: 10000000;
            top: 0;
            left: 0;
            width: 20px;
            height: 20px;
            background: white;
            border: 1px solid red;
            border-radius: 10px;
            margin-left: -10px;
            margin-top: -10px;
            transition: background .2s, border-radius .2s, border-color .2s;
          }
          .mouse-helper.button-1 {
            transition: none;
            background: rgba(0,0,0,0.9);
          }
          .mouse-helper.button-2 {
            transition: none;
            border-color: rgba(0,0,255,0.9);
          }
          .mouse-helper.button-3 {
            transition: none;
            border-radius: 4px;
          }
          .mouse-helper.button-4 {
            transition: none;
            border-color: rgba(255,0,0,0.9);
          }
          .mouse-helper.button-5 {
            transition: none;
            border-color: rgba(0,255,0,0.9);
          }
          `;
        document.head.appendChild(styleElement);
        document.body.appendChild(box);
        document.addEventListener(
          "mousemove",
          (event) => {
            box.style.left = event.pageX + "px";
            box.style.top = event.pageY + "px";
            updateButtons(event.buttons);
          },
          true
        );
        document.addEventListener(
          "mousedown",
          (event) => {
            updateButtons(event.buttons);
            box.classList.add("button-" + event.which);
          },
          true
        );
        document.addEventListener(
          "mouseup",
          (event) => {
            updateButtons(event.buttons);
            box.classList.remove("button-" + event.which);
          },
          true
        );
        function updateButtons(buttons) {
          for (let i = 0; i < 5; i++) box.classList.toggle("button-" + i, !!(buttons & (1 << i)));
        }
      })();
    });

    // 로그아웃 구현
    await page.mouse.move(1040, 30); // 로그아웃 hover하러 이동
    await page.waitForTimeout(1000);
    await page.mouse.click(1040, 30); // 로그아웃 돔 hover
    await page.waitForTimeout(1000);
    await page.mouse.move(1040, 410); // 로그아웃
    await page.waitForTimeout(1000);
    await page.mouse.click(1040, 410); // 로그아웃
    await page.waitForTimeout(2000);

    // 브라우저 종료
    await page.close();
    await browser.close();
  } catch (e) {
    console.error(e);
  }
};

crawler();

const puppeteer = require("puppeteer");
const dotenv = require("dotenv");

const db = require("./models");
dotenv.config();

const crawler = async () => {
  try {
    await db.sequelize.sync();
    const browser = await puppeteer.launch({
      headless: false,
      args: ["--window-size=1920,1080", "--disable-notifications"],
    });
    const page = await browser.newPage();
    await page.setViewport({
      width: 1080,
      height: 1080,
    });
    await page.goto("https://facebook.com");
    await page.type("#email", process.env.EMAIL);
    await page.type("#pass", process.env.PASSWORD);
    await page.waitForTimeout(1000);
    await page.click("button[type=submit]");
    // login 된 시점을 체크
    await page.waitForResponse((response) => {
      return response.url().includes("login");
    });
    // 혹시 나타날 검은 배경화면 없어지도록 ESC 버튼 클릭
    await page.keyboard.press("Escape");

    // 20개 피드를 순회하는 크롤링 구현
    let result = [];
    while (result.length < 10) {
      await page.waitForSelector("[data-pagelet^=FeedUnit_]");
      const newPost = await page.evaluate(() => {
        window.scrollTo(0, 0); // infinite scrolling에 막히지 않도록 추가
        const firstFeed = document.querySelector("[data-pagelet^=FeedUnit_]");
        const name =
          firstFeed.querySelector(".qzhwtbm6.knvmm38d h4") &&
          firstFeed.querySelector(".qzhwtbm6.knvmm38d h4").textContent;
        const content =
          firstFeed.querySelector("[data-ad-comet-preview=message]") &&
          firstFeed.querySelector("[data-ad-comet-preview=message]").textContent;
        const img =
          firstFeed.querySelectorAll("img[class^=i09qtzwb]") && firstFeed.querySelectorAll("img[class^=i09qtzwb]").src;
        const postId = firstFeed.dataset.pagelet.split("_").slice(-1)[0]; // 배열의 마지막 고르기
        return {
          name,
          img,
          content,
          postId,
        };
      });
      // 중복된 피드(이미 좋아요를 누른!)는 데이터에 포함시키지 않는다.
      const exist = await db.Facebook.findOnde({
        where: {
          postId: newPost.postId,
        },
      });
      if (!exist && postId.name) {
        result.push(newPost);
      }
      console.log(newPost);
      await page.waitForTimeout(1000);
      const likeBtn = await page.$("[data-pagelet^=FeedUnit_]:first-child ._666k a");
      await page.evaluate((like) => {
        const sponsor = document.querySelector("").textContent.includes("광고=============");
        if (like.getAttribute("aria-pressed") === "false" && !sponsor) {
          like.click(); // aria-pressed 속성이 false이고 광고글이 아니면 좋아요를 누른다.
        } else if (like.getAttribute("aria-pressed") === "false" && sponsor) {
          like.click(); // 광고글에 좋아요 누른 경우 좋아요를 취소한다.
        }
      }, likeBtn);
      await page.waitForTimeout(1000);
      // 크롤러 동작이 완료되면 해당 피드는 삭제한다.
      await page.evaluate(() => {
        const firstFeed = document.querySelector("[data-pagelet^=FeedUnit_]:first-child");
        firstFeed.parentNode.removeChild(firstFeed);
        window.scrollBy(0, 200); // 지속적인 scrolling을 위해 추가
      });
      await page.waitForTimeout(1000);
    }
    await Promise.all(
      result.map((r) => {
        return db.Facebook.create({
          postId: r.postId,
          media: r.media,
          writer: r.name,
          content: r.content,
        });
      })
    );
    console.log(result.length);
    await page.close();
    await browser.close();
  } catch (e) {
    console.error(e);
  }
};

crawler();

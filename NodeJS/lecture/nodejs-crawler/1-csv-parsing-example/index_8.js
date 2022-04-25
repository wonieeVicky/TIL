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
      userDataDir: "/Users/uneedcomms/Library/Application Support/Google/Chrome/Default", // login 쿠키 삽입
    });
    const page = await browser.newPage();
    await page.setViewport({
      width: 1080,
      height: 1080,
    });
    await page.goto("https://instagram.com");
    // 로그인 여부 확인하는 분기처리 추가
    if (!(await page.waitForSelector('a[href = "/woniee_j/"]'))) {
      await page.waitForSelector("button:not([type=submit])"); // facebook으로 로그인
      await page.click("button:not([type=submit])");
      await page.waitForNavigation(); // facebook 로그인으로 넘어가는 것을 기다린다.

      await page.waitForSelector("#email");
      await page.type("#email", process.env.EMAIL);
      await page.type("#pass", process.env.PASSWORD);
      await page.waitForTimeout(1000);
      await page.waitForSelector("#loginbutton");
      await page.click("#loginbutton");
      await page.waitForNavigation();
    }
    let result = [];
    let prevPostId = "";
    while (result.length < 10) {
      // 더보기 버튼이 있으면 클릭한다.
      // prettier-ignore
      const moreButton = await page.$('article div[data-testid="post-comment-root"] span > div[role="button"] > div');
      if (moreButton) {
        await page.evaluate((btn) => btn.click(), moreButton);
      }
      const newPost = await page.evaluate(() => {
        const article = document.querySelector("article:first-child");
        const postId =
          article.querySelector("time").parentElement.parentElement &&
          article.querySelector("time").parentElement.parentElement.href.split("/").slice(-2, -1)[0];
        const name = article.querySelector("span a[href]").textContent;
        const img = article.querySelector('img[class="FFVAD"]') && article.querySelector('img[class="FFVAD"]').src;
        const content = article.querySelector('div[data-testid="post-comment-root"] > span:last-child').textContent;
        const commentTag = article.querySelectorAll("ul li:not(:first-child");

        let comments = [];
        commentTag.forEach((c) => {
          const name = c.querySelector(".C4VMK h3") && c.querySelector(".C4VMK h3").textContent;
          const comment = c.querySelector(".C4VMK > span") && c.querySelector(".C4VMK > span").textContent;
          comments.push({ name, comment });
        });

        return {
          postId,
          name,
          img,
          content,
          comments,
        };
      });
      // 중복되지 않은 게시글만 추가하기
      if (newPost.postId !== prevPostId) {
        // console.log("newPost:", newPost);
        // result에 없는 아이들만 넣어준다.
        if (!result.find((v) => v.postId === newPost.postId)) {
          const exist = await db.Instagram.findOne({ where: { postId: newPost.postId } });
          // db에 존재하지 않으면 저장한다.
          if (!exist) {
            console.log(result);
            result.push(newPost);
          }
        }
      }
      await page.waitForTimeout(500);
      await page.evaluate(() => {
        const article = document.querySelector("article:first-child");
        const heartBtn = article.querySelector('svg[aria-label="좋아요"][height="24"]');
        if (heartBtn) {
          // heartBtn.parentElement.click();
        }
      });
      prevPostId = newPost.postId;
      await page.waitForTimeout(500);
      await page.evaluate(() => {
        window.scrollBy(0, 800); // scroll down
      });
    }
    await Promise.all(
      result.map((r) => {
        return db.Instagram.create({
          postId: r.postId,
          media: r.img,
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

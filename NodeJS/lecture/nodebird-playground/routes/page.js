const express = require("express");
const { Post, User, Hashtag } = require("../models");
const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.followerCount = req.user ? req.user.Followers.length : 0;
  res.locals.followingCount = req.user ? req.user.Followings.length : 0;
  res.locals.followerIdList = req.user ? req.user.Followings.map((f) => f.id) : [];
  next();
});

router.get("/profile", (req, res) => {
  res.render("profile", { title: "내 정보 - NodeBird" });
});

router.get("/join", (req, res) => {
  res.render("join", { title: "회원가입 - NodeBird" });
});

router.get("/", async (req, res, next) => {
  try {
    res.locals.user = req.user;
    const posts = await Post.findAll({
      include: {
        model: User,
        attributes: ["id", "nick"],
      },
      order: [["createdAt", "DESC"]],
    });
    res.render("main", {
      title: "NodeBird",
      twits: posts,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// GET /hashtag?hashtag=노드
router.get("/hashtag", async (req, res, next) => {
  // API 요청 시 한글이 포함된 경우 : formdata가 아닐 경우 encodeURIComponent - decodeURIComponent 처리
  const query = decodeURIComponent(req.query.hashtag);
  if (!query) {
    return res.redirect("/");
  }
  try {
    const hashtag = await Hashtag.findOne({ where: { title: query } });
    let posts = [];
    if (hashtag) {
      posts = await hashtag.getPosts({ include: [{ model: User, attributes: ["id", "nick"] }] });
    }
    return res.render("main", {
      title: `#${query} 검색 결과 | NodeBird`,
      twits: posts,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;

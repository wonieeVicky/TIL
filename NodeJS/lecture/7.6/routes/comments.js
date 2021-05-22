const express = require("express");
const { Comment, User } = require("../models");

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    // 만약 id와 comment를 독립적으로 등록시켜줘야할 경우
    /* const user = await User.findOne({ where: { id: req.body.id } });
    const comment = await Comment.create({
      comment: req.body.comment,
    });
    const userComment = await user.addComment(comment);
    console.log(userComment);
    res.status(201).json(userComment); */

    const comment = await Comment.create({
      commenter: req.body.id,
      comment: req.body.comment,
    });
    console.log(comment);
    res.status(201).json(comment);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router
  .route("/:id")
  .patch(async (req, res, next) => {
    try {
      const result = await Comment.update(
        {
          comment: req.body.comment,
        },
        {
          where: { id: req.params.id },
        }
      );
      res.json(result);
    } catch (err) {
      console.error(err);
      next(err);
    }
  })
  .delete(async (req, res, next) => {
    try {
      const result = await Comment.destroy({ where: { id: req.params.id } });
      res.json(result);
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

module.exports = router;

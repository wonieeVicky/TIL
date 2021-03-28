# 팔로잉한 게시글(related)한 게시글만 가져오기

내가 팔로잉한 게시글, 내가 팔로잉한 사람들을 제외한 일반 게시글을 가져오는 방법을 구현해보자

`routes/posts.js`

```jsx
// 내가 팔로잉한 유저들의 게시글
router.get('/related', async (req, res, next) => {
  try {
    // 내가 팔로잉한 사람의 아이디를 가져온다.
    const followings = await User.findAll({
      attributes: ['id'],
      include: [
        {
          model: User,
          as: 'Followers',
          where: { id: req.user.id },
        },
      ],
    });
    // SubQuery를 안다면 Sequelize literal로 쿼리를 직접 넣어도됨
    // Op.in : 배열 안의 조건에 부합하면 성공
    const where = {
      UserId: { [Op.in]: followings.map((v) => v.id) },
    };
    // settings...
    const posts = await Post.findAll({
      /* same posts routes.. */
    });
    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// 나와 관계 없는 유저들의 게시글
router.get('/unrelated', async (req, res, next) => {
  try {
    const followings = await User.findAll({
      attributes: ['id'],
      include: [
        {
          model: User,
          as: 'Followers',
          where: { id: req.user.id },
        },
      ],
    });
    const where = {
      UserId: { [Op.notIn]: followings.map((v) => v.id).concat(req.user.id) },
    };
    // settings...
    const posts = await Post.findAll({
      /* same posts routes.. */
    });
    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
```

위와 같이 routes설정 후 프론트에서 로그인 한 뒤 api를 실행해보면 데이터를 볼 수 있음(`http://localhost:3065/posts/related`, `http://localhost:3065/posts/unrelated`)

만약 차단한 사람의 게시글을 보고싶을 경우에는 followings를 User.findAll을 해올 때 `as:Ignored` 로 include 조건을 만들어주면 가능하다. 이럴 경우 먼저 차단기능이 구현되어야 한다..!

# credentials 옵션으로 쿠키 공유 처리

게시글, 코멘트 추가에 대한 API 적용을 마치고 실제 게시글 추가를 테스트해보면 Unauthorized라는 401에러가 떨어진다. 로그인이 성공했는데, 왜 401 Unauthorized가 뜰까? 해당 에러는 middlewares의 isLoggedIn에서 에러 발생 시 떨어지는 로그이다. 왜 로그인이 되지 않았다고 떨어질까? 이는 브라우저의 원리를 알아야 한다.

먼저 이전의 로그인을 구현하면서 도메인이 서로 달라 cors 이슈가 있었다. 해당 개선을 위해 백엔드에서 cors 라이브러리를 활용해 origin에 모든 도메인을 열어주어 해당 이슈를 개선햇는데, 로그인 쿠키도 마찬가지이다. 도메인이 다르면 쿠키도 전달이 안된다. (로그인 여부를 알려주는 쿠키) 따라서 게시글 추가 시 쿠키값이 없으면 백엔드 서버에서는 해당 글이 누가 보냈는지 알 방법이 없으므로 401에러가 발생하는 것이다!

이 부분을 개선하는 방법으로 Proxy를 이용하는 방법도 있지만, cors 설정에 credential 옵션을 추가하여 개선하는 방법도 있다.

`back/app.js`

```jsx
app.use(
  cors({
    credentials: true,
    origin: true, // or http://localhost:3026
  })
);
```

위와 같이 기존의 credentials의 기본값이 false인 것을 true로 변경해주면 되며, 해당 설정을 하면 access-control-allow-credentials가 true가 되어 다른 도메인 간 쿠키 전달이 가능해진다. 단, 보안이 철저해지므로 origin 설정을 true 혹은 쿠키를 주고받을 localhost:3026으로 정확하게 지정해주어야 한다.!

프론트에서도 데이터를 삭제, 추가할 경우 axios 옵션에 withCredentials 를 true로 설정하여 보내주어야 한다. index.js에서 초기에 axios 설정을 해놓으면 모든 액션 구현에 적용되므로 편리하다.

`front/sagas/index.js`

```jsx
axios.defaults.baseURL = "http://localhost:3065";
axios.defaults.withCredentials = true;
```

이후 실제 게시글을 구현해보면 PostCard 컴포넌트에 Image 데이터가 없어서 에러가 발생한다. 해당 내용은 user.js routes에서 로그인 시 팔로잉, 팔로워, 게시글 작성 수를 조합하여 리턴해준 방식과 동일하게 필요한 정보를 병합하여 리턴해주어야 한다.

`back/routes/post.js`

```jsx
const { Post, Comment, User, Image } = require("../models");

router.post("/", isLoggedIn, async (req, res, next) => {
  console.log(req);
  try {
    const post = await Post.create({
      content: req.body.content,
      UserId: req.user.id,
    });

    // 관계있는 테이블을 조합 혹은 제외하여 내려준다.
    const fullPost = await Post.findOne({
      where: { id: post.id },
      include: [
        {
          model: Image,
        },
        {
          model: Comment,
        },
        {
          model: User,
        },
      ],
    });
    res.status(201).json(fullPost);
  } catch (err) {
    console.error(err);
    next(error);
  }
});
```

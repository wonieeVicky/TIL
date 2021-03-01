# 게시글과 댓글 작성하기

현재 로그인 후 게시글과 댓글의 경우 더미데이터로 작성된다. 이 부분을 API로 적용해보자.

먼저 흐름을 다시 보자. PostForm 컴포넌트에서 `dispatch(addPost(text))` 를 통해 액션을 실행시켜주면, reducer의 `addPost`가 실행되어 post.js saga 액션 중 `watchAddPost` → `addPost`이 실행된다. 이제 addPost 제너레이터의 delay 메서드 대신에 실제 API를 동작시켜보자.

`front/sagas/post.js`

먼저 `addPostAPI`에서 req.body.content로 데이터가 전달되도록 하기 위해 data를 content 키가 있는 객체로 변경하여 수정해준다.

```jsx
// code ..
function addPostAPI(data) {
  return axios.post("/post", { content: data }); // req.body.content로 데이터 전달
}

function* addPost(action) {
  try {
    const result = yield call(addPostAPI, action.data);
    const id = shortid.generate();
    yield put({
      type: ADD_POST_SUCCESS,
      data: {
        id,
        content: action.data,
      },
    });
    yield put({
      type: ADD_POST_TO_ME,
      data: id,
    });
  } catch (err) {
    yield put({
      type: ADD_POST_FAILURE,
      error: err.response.data,
    });
  }
}
// code ..
```

다음 back의 addPost Routes를 추가해보자.

`back/routes/post.js`

```jsx
const { Post } = require("../models");
const router = express.Router();

// POST /post
router.post("/", async (req, res, next) => {
  try {
    const post = await Post.create({
      content: req.body.content, // axios.post("/post", { content: data });
    });
    res.status(201).json(post); // 생성된 데이터를 성공 시 반환한다.
  } catch (err) {
    console.error(err);
    next(error);
  }
});
```

위와 같이 수정 후 각 post.js sagas와 reducers 내 더미데이터 영역을 변경해준다.

`front/sagas/post.js`

```jsx
// code ..
function* addPost(action) {
  try {
    const result = yield call(addPostAPI, action.data); // API 성공 시 추가된 데이터가 result로 반환
    yield put({
      type: ADD_POST_SUCCESS,
      data: result.data,
    yield put({
      type: ADD_POST_TO_ME,
      data: result.data.id,
    });
  } catch (err) {
    yield put({
      type: ADD_POST_FAILURE,
      error: err.response.data,
    });
  }
}
// code ..

```

`front/reducers/post.js`

```jsx
// dummyPost 함수 삭제
const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case ADD_POST_SUCCESS:
        draft.mainPosts.unshift(action.data); // dummyPost 함수 제거
        draft.addPostLoading = false;
        draft.addPostDone = true;
        break;
    }
  });
```

이와 동일한 방법으로 addComment도 구현해보자.

먼저 흐름을 살펴보면 CommentForm 컴포넌트에서 `dispatch({ type: ADD_COMMENT_REQUEST, data: { content: commentText, postId: post.id, userId: id }});` 를 통해 액션을 실행하면, reducer의 `addComment`가 실행되어 post.js saga 액션 중 `watchAddComment` → `addComment`이 실행된다. 이제 addComment 제너레이터의 delay 메서드 대신에 실제 API를 동작시켜보자.

`front/sagas/post.js`

```jsx
function addCommentAPI(data) {
  return axios.post(`/post/${data.postId}/comment`, data);
}
function* addComment(action) {
  try {
    const result = yield call(addCommentAPI, action.data); // delay 함수 제거 후 주석 해제
    yield put({
      type: ADD_COMMENT_SUCCESS,
      data: action.data,
    });
  } catch (err) {
    yield put({
      type: ADD_COMMENT_FAILURE,
      error: err.response.data,
    });
  }
```

`back/routes/post.js`

```jsx
const { Post, Comment } = require("../models");

// POST /post/1/comment
// 1. :postId를 통해 파라미터 주입
router.post("/:postId/comment", async (req, res, next) => {
  try {
    // 2. 코멘트 존재유무 검증
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });
    if (!post) {
      return res.status(403).send("존재하지 않는 게시글입니다."); // 반드시 return!
    }
    const comment = await Comment.create({
      content: req.body.content,
      PostId: req.params.postId, // 3. req.params 사용
      UserId: req.user.id,
    });
    res.status(201).json(comment); // 생성된 데이터가 성공 시 반환된다.
  } catch (err) {
    console.error(err);
    next(error);
  }
});
```

1. 주소 부분에서 동적으로 바뀌는 부분을 파라미터라고 한다. 위 :postId를 통해 파라미터 값을 주입할 수 있다.
2. 먼저 코멘트를 달 게시글이 실제 있는 글인지 한번 더 검증한다. 브라우저와 유저의 행동은 예측이 불가능하므로 백엔드에서 꼼꼼히 검증을 진행해주는 것이 좋다.
3. 코멘트 데이터를 create 할 때 PostId의 경우 기존의 req.body.postId로 써도 되지만 API 주소에 파라미터 값을 가져와 사용할 수도 있다. req.params라는 메서드로 postId에 접근 가능

이후 변경 값을 sagas와 reducers에서 업데이트 해준다.

`front/sagas/user.js`

```jsx
function addCommentAPI(data) {
  return axios.post(`/post/${data.postId}/comment`, data);
}
function* addComment(action) {
  try {
    const result = yield call(addCommentAPI, action.data);
    yield put({
      type: ADD_COMMENT_SUCCESS,
      data: result.data, // 요기 변경
    });
  } catch (err) {
    yield put({
      type: ADD_COMMENT_FAILURE,
      error: err.response.data,
    });
  }
```

`front/reducers/user.js`

```jsx
// dummyComment 함수 삭제
const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case ADD_COMMENT_SUCCESS: {
        const post = draft.mainPosts.find((v) => v.id === action.data.PostId);
        post.Comments.unshift(action.data); // dummyComment 함수 적용 삭제
        draft.addCommentLoading = false;
        draft.addCommentDone = true;
        break;
      }
    }
  });
```

addPost, addComment에 대한 routes에도 로그인 여부에 대한 `isLoggedIn` 미들웨어를 추가해준다. (백엔드는 마치 레고를 조립하는 듯한 느낌이다. 필요한 미들웨어를 생성하여 조각해서 붙인 뒤 app.js에서 app.use로 조합하여 내보내주는 구조)

`/back/routes/post.js`

```jsx
const { isLoggedIn } = require("./middlewares");

// POST /post
router.post("/", isLoggedIn, async (req, res, next) => {
  /* codes.. */
});

// POST /post/1/comment
router.post("/:postId/comment", isLoggedIn, async (req, res, next) => {
  /* codes.. */
});

// DELETE /post
router.delete("/", (req, res) => {
  res.json({ id: 1 });
});

module.exports = router;
```

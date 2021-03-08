# 쿼리스트링과 lastId 방식

현재 마우스 스크롤에 따라 중복된 글이 하위에 생기고 있다. 이제 lastId 방식으로 바꿔서 다음 게시글을 불러올 수 있도록 구현해본다. 먼저 글이 10개 이상 있어야 한다. 게시글을 20개 작성하여 10개씩 불러와보도록 한다.

지난 시간에 한번 언급한 적이 있던 limit와 lastId 방식을 구현해보는 것인데, 이 방법은 어떤 것일까?  
바로 LOAD_POSTS_REQUEST에 data값으로 lastId를 함께 보내주는 방식이다. 우선 `pages/index.js` 에서 스크롤 이벤트에 따른 dispatch 이벤트에 lastId를 추가해보자

`components/index.js`

```jsx
const Home = () => {
  useEffect(() => {
    function onScroll() {
      if (
        window.scrollY + document.documentElement.clientHeight >
        document.documentElement.scrollHeight - 300
      ) {
        if (hasMorePosts && !loadPostsLoading) {
          // 가장 마지막 mainPosts의 id 값을 가져온다.
          const lastId = mainPosts[mainPosts.length - 1]?.id;
          dispatch({
            type: LOAD_POSTS_REQUEST,
            lastId,
          });
        }
      }
    }
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [hasMorePosts, loadPostsLoading, mainPosts]);

  return <AppLayout>{/* codes.. */}</AppLayout>;
};

export default Home;
```

위 변경에 따라 saga이벤트, reducer도 바꿔줘야 한다!

`sagas/post.js`

```jsx
function loadPostsAPI(lastId) {
  return axios.get(`/posts?lastId=${lastId || 0}`); // lastId가 undefined일 때는 0으로
}
function* loadPosts(action) {
  try {
    const result = yield call(loadPostsAPI, action.lastId);
    yield put({
      type: LOAD_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: LOAD_POSTS_FAILURE,
      error: err.response.data,
    });
  }
}
```

`reducers/post.js`

```jsx
const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case LOAD_POSTS_REQUEST:
        draft.loadPostsLoading = true;
        draft.loadPostsDone = false;
        draft.loadPostsError = null;
        break;
      case LOAD_POSTS_SUCCESS:
        draft.loadPostsLoading = false;
        draft.loadPostsDone = true;
        draft.mainPosts = draft.mainPosts.concat(action.data); // 최신글이 위로 올라오고, 그 하위에 게시글이 추가되도록 변경
        draft.hasMorePosts = action.data.length === 10; // 해당 게시글이 10개 미만이면 false 반환
        break;
      case LOAD_POSTS_FAILURE:
        draft.loadPostsLoading = false;
        draft.loadPostsError = action.error;
        break;
      default:
        break;
    }
  });

export default reducer;
```

위와 같이 설정 후 GET /posts 액션도 수정해준다.

`routes/posts.js`

```jsx
// GET /posts
router.get("/", async (req, res, next) => {
  try {
    const where = {};
    // 초기 로딩이 아닐 때!
    if (parseInt(req.query.lastId, 10)) {
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10) }; // Op.lt(조건): 해당 id 이하인 데이터만 가져온다.
    }
    const posts = await Post.findAll({
      where, // lastId 방식
      // another settings...
    });
    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    next(err);
  }
});
```

위와 같이 설정해주면 문제없이 lastId로 10개씩 데이터가 호출되어진다. 마지막에는 hasMorePosts가 length 10개 미만일 경우 false로 변하면서 API 호출을 하지 않는 방식으로 구현했다. 단, 마지막 게시글이 10의 배수일 경우 불필요한 API 요청이 1번 발생하지만, 큰 누수가 아니므로 해당 방법으로 진행한다.

다른 방식으로는 현재 데이터가 마지막인지에 대한 정보를 함께 내려주어 해당 데이터로 추가 API 호출을 막는 방식이 있을 수 있다 :)

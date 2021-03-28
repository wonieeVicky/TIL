# 게시글 수정 구현

PostCard에서 게시글 수정하기 기능도 추가로 구현해본다.
먼저 액션 처리에 대한 정의부터 reducer와 saga에 추가해주기

`reducers/post.js`

```jsx
export const initialState = {
  updatePostLoading: false,
  updatePostDone: false,
  updatePostError: null,
};

export const UPDATE_POST_REQUEST = 'UPDATE_POST_REQUEST';
export const UPDATE_POST_SUCCESS = 'UPDATE_POST_SUCCESS';
export const UPDATE_POST_FAILURE = 'UPDATE_POST_FAILURE';

const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case UPDATE_POST_REQUEST:
        draft.updatePostLoading = true;
        draft.updatePostDone = false;
        draft.updatePostError = null;
        break;
      case UPDATE_POST_SUCCESS:
        draft.updatePostLoading = false;
        draft.updatePostDone = true;
        draft.mainPosts.find((v) => v.id === action.data.PostId).content = action.data.content;
        break;
      case UPDATE_POST_FAILURE:
        draft.updatePostLoading = false;
        draft.updatePostError = action.error;
        break;
      default:
        break;
    }
  });

export default reducer;
```

`sagas/posts.js`

```jsx
function updatePostAPI(data) {
  return axios.patch(`/post/${data.PostId}`, data);
}
function* updatePost(action) {
  try {
    const result = yield call(updatePostAPI, action.data);
    yield put({
      type: UPDATE_POST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: UPDATE_POST_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchUpdatePost() {
  yield takeLatest(UPDATE_POST_REQUEST, updatePost);
}

export default function* postSaga() {
  yield all([
    fork(watchUpdatePost),
    // another forks..
  ]);
}
```

그리고 해당 영역에 대한 클릭 이벤트를 PostCard와 PostCardContent에 추가해준다.

`components/PostCard.js`

```jsx
const PostCard = ({ post }) => {
  const [editMode, setEditMode] = useState(false);

  const onClickUpdate = useCallback(() => setEditMode(true));
  const onCancelUpdate = useCallback(() => setEditMode(false));
  const onChangePost = useCallback(
    (editText) => () =>
      dispatch({
        type: UPDATE_POST_REQUEST,
        data: { PostId: post.id, content: editText },
      }),
    [post]
  );

  return (
    <div style={{ marginBottom: 20 }}>
      <Card
        cover={post.Images[0] && <PostImages images={post.Images} />}
        actions={[
          // settings..
          <Popover
            key="more"
            content={
              <Button.Group>
                {id && post.User.id === id ? (
                  <>
                    {/* add */}
                    {!post.RetweetId && <Button onClick={onClickUpdate}>수정</Button>}
                  </>
                ) : (
                  <Button>신고</Button>
                )}
              </Button.Group>
            }
          ></Popover>,
        ]}
      >
        {post.RetweetId && post.Retweet ? (
          <Card cover={post.Retweet.Images[0] && <PostImages images={post.Retweet.Images} />}>
            <Card.Meta
              description={
                <PostCardContent
                  onCancelUpdate={onCancelUpdate} // add
                  onChangePost={onChangePost} // add
                  postData={post.Retweet.content}
                />
              }
            />
          </Card>
        ) : (
          <>
            <div>{moment(post.createdAt).fromNow()}</div>
            <Card.Meta
              description={
                <PostCardContent
                  editMode={editMode}
                  onCancelUpdate={onCancelUpdate} // add
                  onChangePost={onChangePost} // add
                  postData={post.content}
                />
              }
            />
          </>
        )}
      </Card>
    </div>
  );
};

export default PostCard;
```

`components/PostCardContent.js`

```jsx
const PostCardContent = ({ editMode, postData, onCancelUpdate, onChangePost }) => {
  const { updatePostLoading, updatePostDone } = useSelector((state) => state.post);
  const [editText, setEditText] = useState(postData);

  useEffect(() => {
    if (updatePostDone) {
      onCancelUpdate();
    }
  }, [updatePostDone]);

  const onChangeText = useCallback((e) => setEditText(e.target.value), []);

  return (
    <>
      {editMode ? (
        <>
          <TextArea value={editText} onChange={onChangeText} />
          <Button.Group>
            <Button loading={updatePostLoading} onClick={onChangePost(editText)}>
              수정
            </Button>
            <Button type="danger" onClick={onCancelUpdate}>
              취소
            </Button>
          </Button.Group>
        </>
      ) : (/* settings.. */)
      )}
    </>
  );
};

export default PostCardContent;
```

이후 액션 라우팅을 해준다.

`routes/post.js`

```jsx
// PATCH /post/1
router.patch('/:postId', isLoggedIn, async (req, res, next) => {
  const hashtags = req.body.content.match(/#[^\s#]+/g);
  try {
    await Post.update(
      { content: req.body.content },
      {
        where: { id: req.params.postId, UserId: req.user.id },
      }
    );
    const post = await Post.findOne({ where: { id: req.params.postId } }); // 1
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map((tag) => Hashtag.findOrCreate({ where: { name: tag.slice(1).toLowerCase() } }))
      );
      await post.setHashtags(result.map((v) => v[0])); // 2
    }
    res.status(200).json({ PostId: parseInt(req.params.postId, 10), content: req.body.content });
  } catch (err) {
    console.error(err);
    next(err);
  }
});
```

1. Post.update 시 변경된 사항을 변수에 담아 response로 돌려주지 않으므로 하위에 다시 post 변수를 가지고 온다.
2. setHashtags를 하면 기존 Hashtag를 모두 지우고 새로 저장한다.

위와 같이 설정하면 수정데이터로 업데이트되는 것을 확인할 수 있다 !

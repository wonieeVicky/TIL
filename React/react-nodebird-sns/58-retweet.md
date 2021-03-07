# 리트윗 구현

이번에는 리트윗을 구현해본다..! 리트윗은 다른 사람의 글을 리트윗하는 기능이다.

`components/PostCard.js`

```jsx
import { RETWEET_REQUEST } from "../reducers/post";

const PostCard = ({ post }) => {
  const { removePostLoading, retweetError } = useSelector((state) => state.post);

  useEffect(() => {
    if (retweetError) {
      alert(retweetError);
    }
  }, [retweetError]);

  const onRetweet = useCallback(() => {
    // 더블체크
    if (!id) {
      return alert("로그인이 필요합니다");
    }
    return dispatch({
      type: RETWEET_REQUEST,
      data: post.id,
    });
  }, [id]);

  return (
    <div>
      <Card
        actions={[
          <RetweetOutlined key="retweet" onClick={onRetweet} />,
          {
            /* codes.. */
          },
        ]}
      >
        {/* codes.. */}
      </Card>
    </div>
  );
};

export default PostCard;
```

onRetweet 이벤트를 구현하는데, 먼저 id값이 있는지 사전에 더블체크를 해준다. 이후 dispatch Event로 RETWEET_REQUEST를 구현하고, 실패 시에 대한 alert처리도 useEffect에 추가해준다.

`reducers/post.js`

```jsx
export const initialState = {
  retweetLoading: false,
  retweetDone: false,
  retweetError: null,
};

export const RETWEET_REQUEST = "RETWEET_REQUEST";
export const RETWEET_SUCCESS = "RETWEET_SUCCESS";
export const RETWEET_FAILURE = "RETWEET_FAILURE";

const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case RETWEET_REQUEST:
        draft.retweetLoading = true;
        draft.retweetDone = false;
        draft.retweetError = null;
        break;
      case RETWEET_SUCCESS: {
        draft.retweetLoading = false;
        draft.retweetDone = true;
        draft.mainPosts.unshift(action.data);
        break;
      }
      case RETWEET_FAILURE:
        draft.retweetLoading = false;
        draft.retweetError = action.error;
        break;
      default:
        break;
    }
  });

export default reducer;
```

`sagas/post.js`

```jsx
import { RETWEET_REQUEST, RETWEET_SUCCESS, RETWEET_FAILURE } from "../reducers/post";

function retweetAPI(data) {
  return axios.post(`/post/${data}/retweet`);
}
function* retweet(action) {
  try {
    const result = yield call(retweetAPI, action.data);
    yield put({
      type: RETWEET_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: RETWEET_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchRetweet() {
  yield takeLatest(RETWEET_REQUEST, retweet);
}

export default function* postSaga() {
  yield all([
    fork(watchRetweet),
    {
      /* another forks... */
    },
  ]);
}
```

위와 같이 프론트 액션을 모두 구현한 뒤에는 리트윗 라우터를 구현해주면 된다. 조금 복잡하니 천천히 따라온다!

`routes/post.js`

```jsx
// POST /post/1/retweet
router.post("/:postId/retweet", isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
      include: [
        {
          model: Post,
          as: "Retweet",
        },
      ],
    });
    // 1. 해당 게시글이 존재하는 게시글인지 확인
    if (!post) {
      return res.status(403).send("존재하지 않는 게시글입니다.");
    }

    // 2. 나의 게시글 or 나의 게시글을 리트윗한 글을 리트윗 차단
    if (req.user.id === post.UserId || (post.Retweet && post.Retweet.UserId === req.user.id)) {
      return res.status(403).send("자신의 글은 리트윗 할 수 없습니다.");
    }

    // 3. 리트윗할 타겟 아이디를 가져옴
    const retweetTargetId = post.RetweetId || post.id;

    // 4. 이미 리트윗한 글인지 확인
    const exPost = await Post.findOne({
      where: {
        UserId: req.user.id,
        RetweetId: retweetTargetId,
      },
    });
    if (exPost) {
      return res.status(403).send("이미 리트윗한 글입니다.");
    }

    // 5. 리트윗을 등록하는 기본 코드 구현
    const retweet = await Post.create({
      UserId: req.user.id,
      RetweetId: retweetTargetId,
      content: "retweet",
    });

    // 6. 리트윗한 게시글 정보를 가져오기
    const retweetWithPrevPost = await Post.findOne({
      where: {
        id: retweet.id,
      },
      include: [
        {
          model: Post,
          as: "Retweet",
          include: [
            {
              model: User,
              attributes: ["id", "nickname"],
            },
            { model: Image },
          ],
        },
        {
          model: User,
          attributes: ["id", "nickname"],
        },
        {
          model: Image,
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ["id", "nickname"],
            },
          ],
        },
        {
          model: User,
          as: "Likers",
          attributes: ["id"],
        },
      ],
    });
    res.status(201).json(retweetWithPrevPost);
  } catch (err) {
    console.error(err);
    next(error);
  }
});
```

1. 먼저 Post as Retweet 을 include한 값을 가져와 해당 글이 존재하는 글인지 체크해준다.
2. 나의 글을 리트윗하거나 다른 사람이 나의 글을 리트윗한 것을 다시 내가 리트윗 하는 것은 막아주어야 하므로 해당 코드를 작성해준다. `Post.findOne`으로 Post as Retweet을 include 해주었기 때문에 post.Retweet을 사용하여 체크가 가능하다!
3. 다른 게시글을 리트윗하거나 다른 사람이 다른 게시글을 리트윗한 것을 다시 리트윗 하는 것은 가능하므로 리트윗할 targetId를 가져오는데 먼저, `post.RetweetId`가 있으면 이미 리트윗한 글의 ID, 만약 아니라면 null이 되므로 post.id로 지정해준다!
4. 해당 글이 이미 내가 리트윗한 글인지 한번 더 체크해준다.
5. 위에서 예외조건을 모두 처리했으므로 리트윗 등록을 해주는 기본 코드를 구현한다. 단, 해당 코드만으로는 구체적으로 어떤 게시글이 리트윗 되었는지 알 수 없다.
6. 5의 이유로 인해 리트윗 게시글의 정보를 가져오기 위해 추가적으로 테이블을 include해준다. 위 include 코드를 보면 매우 복잡한 편인데, 위와 같이 가져오는 데이터가 많아질수록 include 정보가 많아지고, 때문에 속도가 매우 느려진다. 따라서 추가 이벤트로 데이터를 확인을 분리할 수 있는 분리하는 것이 좋다. (예, 리트윗 게시글의 코멘트는 별도 이벤트로 분리)

위와 같이 설정 후 리트윗을 실제 화면에서 테스트 해보면 정상적으로 리트윗이 되는 것을 확인할 수 있다. 다만 리트윗 한 게시글이 나의 글에 노출되지 않고 넣어둔 retweet 텍스트만 노출되므로, 이 점을 개선해본다.

`components/PostCard.js`

```jsx
const PostCard = ({ post }) => {
	{/* codes.. */}
  return (
    <div style={{ marginBottom: 20 }}>
      <Card
        {/* codes.. */}
        title={post.RetweetId ? `${post.User.nickname}님이 리트윗하셨습니다.` : null}
      >
        {post.RetweetId && post.Retweet ? (
          <Card cover={post.Retweet.Images[0] && <PostImages images={post.Retweet.Images} />}>
            <Card.Meta
              avatar={<Avatar>{post.User.nickname[0]}</Avatar>}
              title={post.User.nickname}
              description={<PostCardContent postData={post.Retweet.content} />}
            />
          </Card>
        ) : (
          <Card.Meta
            avatar={<Avatar>{post.User.nickname[0]}</Avatar>}
            title={post.User.nickname}
            description={<PostCardContent postData={post.content} />}
          />
        )}
      </Card>
    </div>
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    // settings..
    RetweetId: PropTypes.number,
    Retweet: PropTypes.objectOf(PropTypes.any),
  }).isRequired,
};

export default PostCard;
```

위 코드처럼 post.RetweetId와 post.Retweet 데이터가 있을 때에는 Card 컴포넌트에 Card를 추가해서 넣어주도록 구현한다. 물론 데이터의 경로는 post.Retweet.정보를 사용해주어야 한다.

그런데 위와 같이 구현하면 post.Retweet이 없는 데이터라고 뜬다. 이유는 초기 데이터를 가져올 때 (GET /posts) 리트윗 데이터를 넣어주지 않았기 때문이다. 따라서 해당 라우터에 Retweet 정보를 추가로 넣어준다.

`routes/posts.js`

```jsx
// GET /posts
router.get("/", async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      // settings..
      include: [
        {
          /* another models... */
        },
        {
          model: Post,
          as: "Retweet",
          include: [
            {
              model: User,
              attributes: ["id", "nickname"],
            },
            { model: Image },
          ],
        },
      ],
    });
    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    next(err);
  }
});
```

위와 같이 설정해주면 문제없이 리트윗 UI가 그려지는 것을 확인할 수 있다!

추가적으로 나의 글을 리트윗할 경우 컴포넌트가 리렌더링이 발생하여 alert가 계속 뜨는 에러가 있는데 이 부분에 대해 개선해보자. 현상을 보면 게시글이 8개인 상황에서 8번 alert가 발생한다. PostCard에서 useEffect를 사용했기 때문에 전체 게시글에 이벤트가 전파되는 이슈이므로 해당 useEffect의 위치를 조정해줘야 한다. 따라서 해당 useEffect를 pages/index.js로 올려주니 한번만 alert가 실행되는 것을 확인할 수 있다.

해당 방법이 아니더라도 id값을 함께 가져와서 해당 id의 게시글에만 alert가 발생하도록 구현하는 방법도 있다. 방법은 정해진 것이 없으므로 넓은 사고로 문제를 처리해보도록 하자 :)

# 게시글 좋아요 구현

이번 시간에는 게시글에 누르는 좋아요를 실제로 API로 구현해본다!

해당 액션을 구현하기 위해 기존의 PostCard 컴포넌트에서 useState 값으로 만들어놓은 liked, setLiked는 삭제해준다. 그리고 onToggleLiked도 모두 삭제하고, dispatch 이벤트로 해당 동작을 구현하도록 하자.

`front/components/PostCard.js`

```jsx
const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const onLike = useCallback(() => dispatch({ type: LIKE_POST_REQUEST, data: post.id }), []);
  const onUnlike = useCallback(() => dispatch({ type: UNLIKE_POST_REQUEST, data: post.id }), []);

	// codes..
  return (
    <div style={{ marginBottom: 20 }}>
      <Card
        actions={[
          <RetweetOutlined key="retweet" />,
          liked ? (
            <HeartTwoTone twoToneColor="#eb2f96" key="heart" onClick={onUnlike} />
          ) : (
            <HeartOutlined key="heart" onClick={onLike} />
          ),
          // codes..
      >
				{/* codes.. */}
      </Card>
    </div>
  );
};

export default PostCard;
```

이후 LIKE_POST_REQUEST, UNLIKE_POST_REQUEST에 대한 액션을 리듀서와 saga에 각각 추가한다.

`front/reducer/post.js`

```jsx
import produce from "immer";

export const initialState = {
  likePostLoading: false,
  likePostDone: false,
  likePostError: null,
  unlikePostLoading: false,
  unlikePostDone: false,
  unlikePostError: null,
};

export const UNLIKE_POST_REQUEST = "UNLIKE_POST_REQUEST";
export const UNLIKE_POST_SUCCESS = "UNLIKE_POST_SUCCESS";
export const UNLIKE_POST_FAILURE = "UNLIKE_POST_FAILURE";

export const LIKE_POST_REQUEST = "LIKE_POST_REQUEST";
export const LIKE_POST_SUCCESS = "LIKE_POST_SUCCESS";
export const LIKE_POST_FAILURE = "LIKE_POST_FAILURE";

// reducer는 이전 상태를 액션을 통해 다음 상태로 만드는 함수
// 단 불변성은 지ㅣ면서
const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case LIKE_POST_REQUEST:
        draft.likePostLoading = true;
        draft.likePostDone = false;
        draft.likePostError = null;
        break;
      case LIKE_POST_SUCCESS:
        draft.likePostLoading = false;
        draft.likePostDone = true;
        break;
      case LIKE_POST_FAILURE:
        draft.likePostLoading = false;
        draft.likePostError = action.error;
        break;
      case UNLIKE_POST_REQUEST:
        draft.unlikePostLoading = true;
        draft.unlikePostDone = false;
        draft.unlikePostError = null;
        break;
      case UNLIKE_POST_SUCCESS:
        draft.unlikePostLoading = false;
        draft.unlikePostDone = true;
        break;
      case UNLIKE_POST_FAILURE:
        draft.unlikePostLoading = false;
        draft.unlikePostError = action.error;
        break;
      default:
        break;
    }
  });

export default reducer;
```

`front/sagas/post.js`

```jsx
import { all, fork, delay, put, takeLatest, throttle, call } from "redux-saga/effects";
import shortid from "shortid";
import axios from "axios";
import {
  LIKE_POST_REQUEST,
  LIKE_POST_SUCCESS,
  LIKE_POST_FAILURE,
  UNLIKE_POST_REQUEST,
  UNLIKE_POST_SUCCESS,
  UNLIKE_POST_FAILURE,
} from "../reducers/post";
import { ADD_POST_TO_ME, REMOVE_POST_OF_ME } from "../reducers/user";

function unlikePostAPI(data) {
  return axios.delete(`/post/${data}/unlike`);
}
function* unlikePost(action) {
  try {
    const result = yield call(unlikePostAPI, action.data);
    yield put({
      type: UNLIKE_POST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: UNLIKE_POST_FAILURE,
      error: err.response.data,
    });
  }
}
function likePostAPI(data) {
  return axios.patch(`/post/${data}/like`);
}
function* likePost(action) {
  try {
    const result = yield call(likePostAPI, action.data);
    yield put({
      type: LIKE_POST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: LIKE_POST_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchUnlikePost() {
  yield takeLatest(UNLIKE_POST_REQUEST, unlikePost);
}
function* watchLikePost() {
  yield takeLatest(LIKE_POST_REQUEST, likePost);
}

export default function* postSaga() {
  yield all([fork(watchUnlikePost), fork(watchLikePost)]);
}
```

프론트에 액션 함수를 추가했으므로 이제 백엔드로 가서 like, unlike에 대한 API를 완성해보자!

`back/routes/post.js`

```jsx
const express = require("express");
const { Post, Comment, User, Image } = require("../models");
const { isLoggedIn } = require("./middlewares");

const router = express.Router();

// PATCH /post/1/like
router.patch("/:postId/like", async (req, res, next) => {
  try {
    const post = await Post.findOne({ where: { id: req.params.postId } });
    if (!post) {
      return res.status(403).send("존재하지 않는 게시글입니다.");
    }
    await post.addLikers(req.user.id); // db 조작할 떄는 반드시 await 붙여준다.
    res.json({ PostId: post.id, UserId: req.user.id });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// DELETE /post/1/unlike
router.delete("/:postId/unlike", async (req, res, next) => {
  try {
    const post = await Post.findOne({ where: { id: req.params.postId } });
    if (!post) {
      return res.status(403).send("존재하지 않는 게시글입니다.");
    }
    await post.removeLikers(req.user.id); // db 조작할 떄는 반드시 await 붙여준다.
    res.json({ PostId: post.id, UserId: req.user.id });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
```

위와 같이 patch, delete routes를 구현해준다. 위에서 사용한 post.addLikers, post.removeLikers는 어디서 왔을까? 바로 `models/post.js`가 지정된 associate에 따라 해당 메서드들을 구현해주는데 이는 add, get, set 등의 메서드로 만들어진다. 이는 모두 시퀄라이즈가 자동으로 만들어주는 기능이다. 보통 include 메서드를 통해 정보를 가져와 사용하지만, 쉽게 두 개의 테이블 관계를 통해 쉽게 데이터 핸들링을 할 수 있다.

```jsx
// models/post.js 하단 assiociate에서 설정한 관계테이블에 따라 각종 메서드 구현
Post.associate = (db) => {
  db.Post.belongsTo(db.User); // post.addUser, post.getUser, post.setUser
  db.Post.belongsToMany(db.Hashtag, { through: "PostHashtag" }); // post.addHashtags
  db.Post.hasMany(db.Comment); // post.addComments, post.getComments
  db.Post.hasMany(db.Image); // post.addImages, post.getImages
  db.Post.belongsToMany(db.User, { through: "Like", as: "Liked" }); // post.addLikers, post.removeLikers
  db.Post.belongsTo(db.Post, { as: "Retweet" }); // post.addRetweet
};
```

이렇게 하고 sagas에서 반환되는 result.data에 따라 리듀서 영역도 수정해주자.

```jsx
import produce from "immer";

// reducer는 이전 상태를 액션을 통해 다음 상태로 만드는 함수
// 단 불변성은 지ㅣ면서
const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case LIKE_POST_SUCCESS: {
        const post = draft.mainPosts.find((v) => v.id === action.data.PostId);
        post.Likers.push({ id: action.data.UserId });
        draft.likePostLoading = false;
        draft.likePostDone = true;
        break;
      }
      case UNLIKE_POST_SUCCESS: {
        const post = draft.mainPosts.find((v) => v.id === action.data.PostId);
        post.Likers = post.Likers.filter((v) => v.id !== action.data.UserId);
        draft.unlikePostLoading = false;
        draft.unlikePostDone = true;
        break;
      }
      // codes..
    }
  });

export default reducer;
```

이렇게 수정해준 뒤 페이지를 새로고침해주면 당연히 에러가 발생한다 !! 😑 postCard에 liked라는 status가 없기 때문인데, 이 부분은 post 게시글 안에 Likers를 찾아 내 아이디로 된 좋아요 id가 있으면 활성화 시켜주면 된다. post내부에 Likers라는 데이터가 신규로 추가되므로 하단 PropType에도 명시해준다.

```jsx
import { LIKE_POST_REQUEST, UNLIKE_POST_REQUEST, REMOVE_POST_REQUEST } from "../reducers/post";

const PostCard = ({ post }) => {
  const id = useSelector((state) => state.user.me?.id);
  const liked = post.Likers.find((v) => v.id === id);

  return {
    /* codes.. */
  };
};

PostCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number,
    User: PropTypes.object,
    content: PropTypes.string,
    createdAt: PropTypes.string,
    Comments: PropTypes.arrayOf(PropTypes.object),
    Images: PropTypes.arrayOf(PropTypes.object),
    Likers: PropTypes.arrayOf(PropTypes.object), // 추가
  }).isRequired,
};

export default PostCard;
```

그런데 현재 초기 posts정보나 post를 가져올 때 저 post.Likers를 routes에서 따로 내려주는 부분이 없다. 따라서 해당 부분을 routes에도 추가해줘야한다..! 다만 이 또한 User 모델을 사용하므로 model의 associate에서 지정해준 것과 같이 별칭 Likers를 붙여주어야 한다.

`back/routes/post.js`

```jsx
// POST /post
router.post("/", isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.create({
      content: req.body.content,
      UserId: req.user.id,
    });
    const fullPost = await Post.findOne({
      where: { id: post.id },
      include: [
        {
          model: Image,
        },
        {
          model: Comment,
          include: [
            {
              model: User, // 댓글 작성자 User
              attributes: ["id", "nickname"],
            },
          ],
        },
        {
          model: User, // 작성자 User
          attributes: ["id", "nickname"],
        },
        {
          model: User, // 좋아요 누른 User
          as: "Likers",
          attributes: ["id"],
        },
      ],
    });
    res.status(201).json(fullPost);
  } catch (err) {
    console.error(err);
    next(error);
  }
});

module.exports = router;
```

`back/routes/posts.js`

```jsx
// GET /posts
router.get("/", async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      // where: { id: lastId },
      limit: 10,
      order: [["createdAt", "DESC"]],
      include: [
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
              order: [["createdAt", "DESC"]],
            },
          ],
        },
        {
          model: User, // 좋아요 누른 User 추가!
          as: "Likers",
          attributes: ["id"],
        },
      ],
    });
    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
```

위와 같이 설정 후 페이지 새로고침을 해주면 정상적으로 post마다 Likers라는 데이터가 들어오는 것을 확인할 수 있다 : )

# 특정 사용자 게시글, 해시태그 게시글

특정 사용자의 게시글을 모두 가지고 오는 것을 다이나믹 라우팅으로 구현해보자! 액션 리듀서를 생성할 때에는 해시태그로 게시글을 검색해올 것이기 때문에 해당 액션까지 함께 만들어주겠다!

먼저 다이나믹 라우팅 페이지를 생성해준 뒤 컴포넌트를 완성해본다.

`pages/user/[id].js`

```jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Card } from "antd";
import { END } from "redux-saga";
import Head from "next/head";
import { useRouter } from "next/router";

import axios from "axios";
import { LOAD_USER_POSTS_REQUEST } from "../../reducers/post";
import { LOAD_MY_INFO_REQUEST, LOAD_USER_REQUEST } from "../../reducers/user";
import PostCard from "../../components/PostCard";
import wrapper from "../../store/configureStore";
import AppLayout from "../../components/AppLayout";

const User = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = router.query;
  const { mainPosts, hasMorePosts, loadPostsLoading } = useSelector((state) => state.post);
  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    const onScroll = () => {
      if (
        window.pageYOffset + document.documentElement.clientHeight >
        document.documentElement.scrollHeight - 300
      ) {
        if (hasMorePosts && !loadPostsLoading) {
          dispatch({
            type: LOAD_USER_POSTS_REQUEST,
            lastId: mainPosts[mainPosts.length - 1] && mainPosts[mainPosts.length - 1].id,
            data: id,
          });
        }
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [mainPosts.length, hasMorePosts, id, loadPostsLoading]);

  return (
    <AppLayout>
      {userInfo && (
        <Head>
          <title>
            {userInfo.nickname}
            님의 글
          </title>
          <meta name="description" content={`${userInfo.nickname}님의 게시글`} />
          <meta property="og:title" content={`${userInfo.nickname}님의 게시글`} />
          <meta property="og:description" content={`${userInfo.nickname}님의 게시글`} />
          <meta property="og:image" content="https://nodebird.com/favicon.ico" />
          <meta property="og:url" content={`https://nodebird.com/user/${id}`} />
        </Head>
      )}
      {userInfo ? (
        <Card
          actions={[
            <div key="twit">
              짹짹
              <br />
              {userInfo.Posts}
            </div>,
            <div key="following">
              팔로잉
              <br />
              {userInfo.Followings}
            </div>,
            <div key="follower">
              팔로워
              <br />
              {userInfo.Followers}
            </div>,
          ]}
        >
          <Card.Meta avatar={<Avatar>{userInfo.nickname[0]}</Avatar>} title={userInfo.nickname} />
        </Card>
      ) : null}
      {mainPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </AppLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  const cookie = context.req ? context.req.headers.cookie : "";
  axios.defaults.headers.Cookie = "";
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }
  context.store.dispatch({
    type: LOAD_USER_POSTS_REQUEST,
    data: context.params.id,
  });
  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });
  context.store.dispatch({
    type: LOAD_USER_REQUEST,
    data: context.params.id,
  });
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
  console.log("getState", context.store.getState().post.mainPosts);
  return { props: {} };
});

export default User;
```

이후 새로 생성된 `LOAD_USER_POSTS_REQUEST`를 구현해주는데, 이 때 `LOAD_HASHTAG_POSTS_REQUEST`도 함께 구현해준다..!

`reducers/post.js`

```jsx
import produce from "immer";

export const LOAD_HASHTAG_POSTS_REQUEST = "LOAD_HASHTAG_POSTS_REQUEST";
export const LOAD_HASHTAG_POSTS_SUCCESS = "LOAD_HASHTAG_POSTS_SUCCESS";
export const LOAD_HASHTAG_POSTS_FAILURE = "LOAD_HASHTAG_POSTS_FAILURE";

export const LOAD_USER_POSTS_REQUEST = "LOAD_USER_POSTS_REQUEST";
export const LOAD_USER_POSTS_SUCCESS = "LOAD_USER_POSTS_SUCCESS";
export const LOAD_USER_POSTS_FAILURE = "LOAD_USER_POSTS_FAILURE";

const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case LOAD_USER_POSTS_REQUEST:
      case LOAD_HASHTAG_POSTS_REQUEST:
      case LOAD_POSTS_REQUEST:
        draft.loadPostsLoading = true;
        draft.loadPostsDone = false;
        draft.loadPostsError = null;
        break;
      case LOAD_USER_POSTS_SUCCESS:
      case LOAD_HASHTAG_POSTS_SUCCESS:
      case LOAD_POSTS_SUCCESS:
        draft.loadPostsLoading = false;
        draft.loadPostsDone = true;
        draft.mainPosts = draft.mainPosts.concat(action.data);
        draft.hasMorePosts = action.data.length === 10; // 해당 게시글이 10개 미만이면 false 반환
        break;
      case LOAD_USER_POSTS_FAILURE:
      case LOAD_HASHTAG_POSTS_FAILURE:
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

이번에는 해당 두 액션의 액션 초기값과 리듀서를 설정해주지 않았다. 액션에 대한 데이터 처리를 `LOAD_POSTS` 리듀서에 함께 중첩하여 적용해주었는데 이유가 무엇일까? 문제가 되지 않기 때문이다. 한 페이지에서 해당 액션 두 개가 같이 쓰이지 않을 경우 리듀서를 중복하여 사용해도 무방하다. state를 줄여서 코드량을 줄일 수 있을 때 줄여주는 것이 좋다.

`sagas/post.js`

```jsx
import {
  LOAD_USER_POSTS_REQUEST,
  LOAD_HASHTAG_POSTS_REQUEST,
  LOAD_USER_POSTS_SUCCESS,
  LOAD_USER_POSTS_FAILURE,
  LOAD_HASHTAG_POSTS_SUCCESS,
  LOAD_HASHTAG_POSTS_FAILURE,
} from "../reducers/post";

function loadUserPostsAPI(data, lastId) {
  return axios.get(`/user/${data}/posts?lastId=${lastId || 0}`); // lastId가 undefined일 때는 0으로
}
function* loadUserPosts(action) {
  try {
    const result = yield call(loadUserPostsAPI, action.data, action.lastId);
    yield put({
      type: LOAD_USER_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: LOAD_USER_POSTS_FAILURE,
      error: err.response.data,
    });
  }
}

function loadHashtagPostsAPI(data, lastId) {
  return axios.get(`/hashtag/${encodeURIComponent(data)}?lastId=${lastId || 0}`); // lastId가 undefined일 때는 0으로
}
function* loadHashtagPosts(action) {
  try {
    const result = yield call(loadHashtagPostsAPI, action.data, action.lastId);
    yield put({
      type: LOAD_HASHTAG_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: LOAD_HASHTAG_POSTS_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchLoadUserPosts() {
  yield throttle(5000, LOAD_USER_POSTS_REQUEST, loadUserPosts);
}
function* watchLoadHashtagPosts() {
  yield throttle(5000, LOAD_HASHTAG_POSTS_REQUEST, loadHashtagPosts);
}

export default function* postSaga() {
  yield all([fork(watchLoadUserPosts), fork(watchLoadHashtagPosts)]);
}
```

마지막으로 라우터도 구현해준다..!

`routes/user.js`

```jsx
// GET /user/:userId/posts
router.get("/:userId/posts", async (req, res, next) => {
  try {
    const where = { UserId: req.params.userId }; // where만 최적화
    if (parseInt(req.query.lastId, 10)) {
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10) };
    }
    const posts = await Post.findAll({
      /* GET posts.js와 동일 */
    });
    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    next(err);
  }
});
```

`routes/hashtag.js`

```jsx
const express = require("express");
const router = express.Router();
const { Post, Hashtag, Image, Comment, User } = require("../models");

// GET /hashtag/노드
router.get("/:hashtag", async (req, res, next) => {
  try {
    const where = {};
    if (parseInt(req.query.lastId, 10)) {
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10) };
    }
    const posts = await Post.findAll({
      where,
      limit: 10,
      order: [["createdAt", "DESC"]],
      include: [
        // include 안에 넣어준 모델에 where를 적용할 수도 있다.
        { model: Hashtag, where: { name: decodeURIComponent(req.params.hashtag) } },
        {
          /* another include... */
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

위 hashtag는 처음 만들어진 라우터이므로 app.js에서 연결해준다.

`back/app.js`

```jsx
const hashtagRouter = require("./routes/hashtag");

app.use("/hashtag", hashtagRouter);
```

이후 먼저 생성해둔 User 다이나믹 라우팅 페이지(localhost:3026/user/1)로 이동하면 해당 id의 게시글만 잘 노출되는 것을 확인할 수 있다!!

동일하게 같은 해시태그를 가진 글을 조회하는 페이지를 만들어보자!

`front/pages/hashtag/[tag].js` ⇒ 이번엔 [id]가 아니고 [tag]다

```jsx
// hashtag/[tag].js
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { END } from "redux-saga";

import axios from "axios";
import { LOAD_HASHTAG_POSTS_REQUEST } from "../../reducers/post";
import PostCard from "../../components/PostCard";
import wrapper from "../../store/configureStore";
import { LOAD_MY_INFO_REQUEST } from "../../reducers/user";
import AppLayout from "../../components/AppLayout";

const Hashtag = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { tag } = router.query;
  const { mainPosts, hasMorePosts, loadPostsLoading } = useSelector((state) => state.post);

  useEffect(() => {
    const onScroll = () => {
      if (
        window.pageYOffset + document.documentElement.clientHeight >
        document.documentElement.scrollHeight - 300
      ) {
        if (hasMorePosts && !loadPostsLoading) {
          dispatch({
            type: LOAD_HASHTAG_POSTS_REQUEST,
            lastId: mainPosts[mainPosts.length - 1] && mainPosts[mainPosts.length - 1].id,
            data: tag,
          });
        }
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [mainPosts.length, hasMorePosts, tag, loadPostsLoading]);

  return (
    <AppLayout>
      {mainPosts.map((c) => (
        <PostCard key={c.id} post={c} />
      ))}
    </AppLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  console.log(context);
  const cookie = context.req ? context.req.headers.cookie : "";
  console.log(context);
  axios.defaults.headers.Cookie = "";
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }
  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });
  context.store.dispatch({
    type: LOAD_HASHTAG_POSTS_REQUEST,
    data: context.params.tag,
  });
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});

export default Hashtag;
```

상기 user의 [id].js 컴포넌트와 거의 유사하되, `const { tag } = router.query;`영역만 다르다.

위처럼 구현해주면 해당 해시태그를 가진 글들을 조회하는 페이지를 확인할 수 있다 :)

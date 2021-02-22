# 팔로우, 언팔로우 구현하기

먼저 팔로우 버튼을 넣을 곳을 PostCard 컴포넌트에서 지정해준다.

```jsx
import FollowButton from "./FollowButton";

const PostCard = ({ post }) => {
  return (
    <div style={{ marginBottom: 20 }}>
      <Card
        cover={post.Images[0] && <PostImages images={post.Images} />}
        actions={/* actions.. */}
        extra={id && <FollowButton post={post} />} // FollowButton 컴포너트 추가!
      >
        <Card.Meta
          avatar={<Avatar>{post.User.nickname[0]}</Avatar>}
          title={post.User.nickname}
          description={<PostCardContent postData={post.content} />}
        />
      </Card>
    </div>
  );
};

export default PostCard;
```

그리고 액션들을 reducer와 saga로 구현해준다!

`/reducer/user.js`

```jsx
import produce from "immer";
export const initialState = {
  followLoading: false, // 팔로우 시도중
  followDone: false,
  followError: null,
  unfollowLoading: false, // 언팔로우 시도중
  unfollowDone: false,
  unfollowError: null,
};

export const FOLLOW_REQUEST = "FOLLOW_REQUEST";
export const FOLLOW_SUCCESS = "FOLLOW_SUCCESS";
export const FOLLOW_FAILURE = "FOLLOW_FAILURE";

export const UNFOLLOW_REQUEST = "UNFOLLOW_REQUEST";
export const UNFOLLOW_SUCCESS = "UNFOLLOW_SUCCESS";
export const UNFOLLOW_FAILURE = "UNFOLLOW_FAILURE";

const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case FOLLOW_REQUEST:
        draft.followLoading = true;
        draft.followDone = false;
        draft.followError = null;
        break;
      case FOLLOW_SUCCESS:
        draft.followLoading = false;
        draft.followDone = true;
        draft.me.Followings.push({ id: action.data });
        break;
      case FOLLOW_FAILURE:
        draft.followLoading = false;
        draft.followError = action.error;
        break;
      case UNFOLLOW_REQUEST:
        draft.unfollowLoading = true;
        draft.unfollowDone = false;
        draft.unfollowError = null;
        break;
      case UNFOLLOW_SUCCESS:
        draft.unfollowLoading = false;
        draft.unfollowDone = true;
        draft.me.Followings = draft.me.Followings.filter((v) => v.id !== action.data);
        draft.me = dummyUser(action.data);
        break;
      case UNFOLLOW_FAILURE:
        draft.unfollowLoading = false;
        draft.unfollowError = action.error;
        break;
    }
  });

export default reducer;
```

`/sagas/user.js`

```jsx
import { all, fork, delay, put, takeLatest } from "redux-saga/effects";
import {
  FOLLOW_REQUEST,
  FOLLOW_SUCCESS,
  FOLLOW_FAILURE,
  UNFOLLOW_REQUEST,
  UNFOLLOW_SUCCESS,
  UNFOLLOW_FAILURE,
} from "../reducers/user";
import axios from "axios";

function followAPI(data) {
  return axios.post("/api/login", data);
}
function* follow(action) {
  try {
    // const result = yield call(followAPI);
    yield delay(1000);
    yield put({
      type: FOLLOW_SUCCESS,
      data: action.data,
    });
  } catch (err) {
    yield put({
      type: FOLLOW_FAILURE,
      error: err.response.data,
    });
  }
}
function unfollowAPI(data) {
  return axios.post("/api/login", data);
}
function* unfollow(action) {
  try {
    // const result = yield call(unfollowAPI);
    yield delay(1000);
    yield put({
      type: UNFOLLOW_SUCCESS,
      data: action.data,
    });
  } catch (err) {
    yield put({
      type: UNFOLLOW_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchFollow() {
  yield takeLatest(FOLLOW_REQUEST, follow);
}
function* watchUnfollow() {
  yield takeLatest(UNFOLLOW_REQUEST, unfollow);
}

export default function* userSaga() {
  yield all([fork(watchFollow), fork(watchUnfollow)]);
}
```

이후 액션에 대한 FollowButton 컴포넌트를 구체화해준다 !

```jsx
import { Button } from "antd";
import PropTypes from "prop-types";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FOLLOW_REQUEST, UNFOLLOW_REQUEST } from "../reducers/user";

const FollowButton = ({ post }) => {
  const dispatch = useDispatch();
  const { me, followLoading, unfollowLoading } = useSelector((state) => state.user);
  const isFollowing = me?.Followings.find((v) => v.id === post.User.id);

  // onclick 버튼에서 팔로우, 언팔로우를 처리해준다.
  const onCLickButton = useCallback(() => {
    if (isFollowing) {
      dispatch({
        type: UNFOLLOW_REQUEST,
        data: post.User.id,
      });
    } else {
      dispatch({
        type: FOLLOW_REQUEST,
        data: post.User.id,
      });
    }
  }, [isFollowing]);

  return (
    <Button loading={unfollowLoading || followLoading} onClick={onCLickButton}>
      {isFollowing ? "언팔로우" : "팔로우"}
    </Button>
  );
};

FollowButton.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number,
    User: PropTypes.object,
    content: PropTypes.string,
    createdAt: PropTypes.object,
    Comments: PropTypes.arrayOf(PropTypes.object),
    Images: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
};

export default FollowButton;
```

### 생각해보기

현재 레이아웃으로 팔로잉, 언팔로잉을 진행하면 전체 버튼에 loading버튼이 같이 맞물려 돌아가는 것을 확인할 수 있다. 텍스트도 동시에 다같이 바뀜.. 이 부분은 어떻게 하면 개선할 수 있을지 생각해보자 :)

LOAD_FOLLOW_REQUEST에 post id도 같이 넣어 해당 포스트에서만 버튼이 동작하게끔 제한하는 방법!

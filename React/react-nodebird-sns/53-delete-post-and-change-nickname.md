# 게시글 제거와 닉네임 변경

게시글 삭제를 구현해볼 차례인데, 이번에는 프론트가 아닌 백엔드 API 부터 먼저 작업해보자. 순서가 중요치 않도록 자유자재로 구현이 가능하도록 연습해야 한다!

`back/routes/post.js`

```jsx
// DELETE /post/1
router.delete("/:postId", isLoggedIn, async (req, res, next) => {
  try {
    // 내가 쓴 게시글을 지우도록 보안 철저하게 처리
    await Post.destroy({
      where: { id: req.params.postId, UserId: req.user.id },
    });
    res.status(200).json({ PostId: parseInt(req.params.postId, 10) });
  } catch (err) {
    console.error(err);
    next(err);
  }
});
```

게시글 delete 메서드에서는 `destroy` 메서드를 사용한다. 또 위 코드를 보면 데이터를 조회할 때 UserId로 내가 쓴 글만 지울 수 있도록 한번 더 확인 처리를 해주고 있다. 내가 쓴 게시글만 지울 수 있도록 보안을 철저하게 처리해야 이슈가 없으니 주의하도록 하자!

이와 작업하는 김에 닉네임 변경 API도 구현해보자

`back/routes/user.js`

```jsx
// PATCH /nickname
router.patch("/nickname", isLoggedIn, async (req, res, next) => {
  try {
    await User.update(
      {
        nickname: req.body.nickname,
      },
      { where: { id: req.user.id } }
    );
    res.status(200).json({ nickname: req.body.nickname });
  } catch (err) {
    console.error(err);
    next(err);
  }
});
```

PATCH 시에는 `update`라는 메서드를 사용한다. 첫 번째 인자로 바꿀 값을 넣어주고, 두 번째는 조건 값을 넣어준다. (내 아이디일 경우에만 업데이트하도록!)

이제 백엔드 정보에 따라 프론트 액션도 반영해 줄 차례이다 !

`front/reducers/user.js`

닉네임 변경 시 액션함수는 이미 만들어져있으므로, reducer의 데이터 처리만 추가해준다.

```jsx
import produce from "immer";

const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case CHANGE_NICKNAME_REQUEST:
        draft.changeNicknameLoading = true;
        draft.changeNicknameDone = false;
        draft.changeNicknameError = null;
        break;
      case CHANGE_NICKNAME_SUCCESS:
        draft.me.nickname = action.data.nickname; // 추가!
        draft.changeNicknameLoading = false;
        draft.changeNicknameDone = true;
        break;
      case CHANGE_NICKNAME_FAILURE:
        draft.changeNicknameLoading = false;
        draft.changeNicknameError = action.error;
        break;
      default:
        break;
    }
  });

export default reducer;
```

`front/sagas/user.js`

```jsx
import { all, call, fork, delay, put, takeLatest } from "redux-saga/effects";
import {
  CHANGE_NICKNAME_REQUEST,
  CHANGE_NICKNAME_SUCCESS,
  CHANGE_NICKNAME_FAILURE,
} from "../reducers/user";
import axios from "axios";

function changeNicknameAPI(data) {
  return axios.patch("/user/nickname", { nickname: data });
}
function* changeNickname(action) {
  try {
    const result = yield call(changeNicknameAPI, action.data);
    yield put({
      type: CHANGE_NICKNAME_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: CHANGE_NICKNAME_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchChangeNickname() {
  yield takeLatest(CHANGE_NICKNAME_REQUEST, changeNickname);
}

export default function* userSaga() {
  yield all([
    fork(watchChangeNickname),
    // another forks..
  ]);
}
```

동일하게 REMOVE_POST액션에 대한 처리도 아래와 같이 추가해준다.

`front/reducers/post.js`

```jsx
import produce from "immer";

export const initialState = {
  removePostLoading: false,
  removePostDone: false,
  removePostError: null,
};

export const REMOVE_POST_REQUEST = "REMOVE_POST_REQUEST";
export const REMOVE_POST_SUCCESS = "REMOVE_POST_SUCCESS";
export const REMOVE_POST_FAILURE = "REMOVE_POST_FAILURE";

const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case REMOVE_POST_REQUEST:
        draft.removePostLoading = true;
        draft.removePostDone = false;
        draft.removePostError = null;
        break;
      case REMOVE_POST_SUCCESS:
        draft.mainPosts = draft.mainPosts.filter((v) => v.id !== action.data.PostId); // 추가!
        draft.removePostLoading = false;
        draft.removePostDone = true;
        break;
      case REMOVE_POST_FAILURE:
        draft.removePostLoading = false;
        draft.removePostError = action.error;
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
import { REMOVE_POST_REQUEST, REMOVE_POST_SUCCESS, REMOVE_POST_FAILURE } from "../reducers/post";

function removePostAPI(data) {
  return axios.delete(`/post/${data}`); // delete는 data를 넣어줄 수 없다.
}
function* removePost(action) {
  try {
    const result = yield call(removePostAPI, action.data);
    yield put({
      type: REMOVE_POST_SUCCESS,
      data: result.data,
    });
    yield put({
      type: REMOVE_POST_OF_ME,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: REMOVE_POST_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchRemovePost() {
  yield takeLatest(REMOVE_POST_REQUEST, removePost);
}

export default function* postSaga() {
  yield all([
    fork(watchRemovePost),
    // another forks..
  ]);
}
```

위와 같이 설정 후 페이지에서 기능을 동작 시키면 둘 모두 정상 동작하는 것을 확인할 수 있다.

이제 팔로우 기능을 구현해보려 한다. 그런데 작업을 하려고 보니 내 글에서 [팔로우] 버튼이 그대로 노출되고 있다! 해당 버튼을 내 글에서는 보이지 않도록 처리해보자.

`front/components/FollowButton.js`

```jsx
import { Button } from "antd";
import PropTypes from "prop-types";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FOLLOW_REQUEST, UNFOLLOW_REQUEST } from "../reducers/user";

const FollowButton = ({ post }) => {
  // hooks and event Codes ...

  // 내 아이디와 post.User.id가 같은 경우 버튼을 렌더링하지 않는다.
  if (post.User.id === me.id) {
    return null;
  }
  return {
    /* codes... */
  };
};

export default FollowButton;
```

이제 팔로우 동작을 구현해 볼 차례이다!

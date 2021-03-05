# 팔로우, 언팔로우

이제 팔로우, 언팔로우 기능을 구현해본다. 이번에도 API 라우팅 작업을 먼저 시작해보자 :)

`routes/user.js`

```jsx
// PATCH /user/1/follow
router.patch("/:userId/follow", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.params.userId } });
    if (!user) {
      res.status(403).send("존재하지 않는 유저입니다.");
    }
    await user.addFollowers(req.user.id);
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
  } catch (err) {
    console.error(err);
    next(err);
  }
});
// DELETE /user/1/follow
router.delete("/:userId/follow", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.params.userId } });
    if (!user) {
      res.status(403).send("존재하지 않는 유저입니다.");
    }
    await user.removeFollowers(req.user.id);
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
  } catch (err) {
    console.error(err);
    next(err);
  }
});
```

위와 같이 설정 후 부족한 리듀서의 데이터 처리 부분과 saga 액션 중 미비한 부분을 채워준다.

`reducers/user.js`

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
        draft.me.Followings.push({ id: action.data.UserId }); // 값 변경
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
        draft.me.Followings = draft.me.Followings.filter((v) => v.id !== action.data.UserId); // 값 변경
        break;
      case UNFOLLOW_FAILURE:
        draft.unfollowLoading = false;
        draft.unfollowError = action.error;
        break;
      default:
        break;
    }
  });

export default reducer;
```

`sagas/user.js`

```jsx
import {
  FOLLOW_REQUEST,
  FOLLOW_SUCCESS
  FOLLOW_FAILURE,
  UNFOLLOW_REQUEST,
  UNFOLLOW_SUCCESS,
  UNFOLLOW_FAILURE,
} from "../reducers/user";

function followAPI(data) {
  return axios.patch(`/user/${data}/follow`);
}
function* follow(action) {
  try {
    const result = yield call(followAPI, action.data);
    yield put({
      type: FOLLOW_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: FOLLOW_FAILURE,
      error: err.response.data,
    });
  }
}

function unfollowAPI(data) {
  return axios.delete(`/user/${data}/follow`);
}
function* unfollow(action) {
  try {
    const result = yield call(unfollowAPI, action.data);
    yield put({
      type: UNFOLLOW_SUCCESS,
      data: result.data,
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
  yield all([
    fork(watchFollow),
    fork(watchUnfollow),
    // another forks...
  ]);
}
```

위와 같이 프론트 내 리듀서 설정을 마쳐준 뒤에는 마지막으로 FollowButton 내 dispatch 이벤트를 고쳐준다.

`components/FloowButton.js`

```jsx
const FollowButton = ({ post }) => {
  const isFollowing = me?.Followings.find((v) => v.id === post.User.id);
  const onClickButton = useCallback(() => {
    if (isFollowing) {
      dispatch({
        type: UNFOLLOW_REQUEST,
        data: post.User.id, // UserId를 data로 전달
      });
    } else {
      dispatch({
        type: FOLLOW_REQUEST,
        data: post.User.id, // UserId를 data로 전달
      });
    }
  }, [isFollowing]);

  return {
    /* codes... */
  };
};

export default FollowButton;
```

이렇게 백엔드와 프론트엔드 작업을 동시에 한다면, 초기에 서비스 및 컴포넌트의 설계 시 이후의 상황에 대해 미리 예견하고 대비하는 방향으로 더미데이터 등을 설계하고 작업해줘야 두 번 일하지 않을 수 있다!

위와 같이 설정 후 팔로우 버튼을 누르면 문제없이 팔로우가 진행되는 것을 확인할 수 있다..! (재미따..! )  
이제 프로필페이지에서 팔로잉, 팔로워 목록을 불러와보자!

`routes/user.js`

```jsx
// GET /user/followers - 내가 팔로워한 사람 목록 가져오기
router.get("/followers", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } }); // 나를 먼저 찾고
    if (!user) {
      res.status(403).send("존재하지 않는 유저입니다.");
    }
    const followers = await user.getFollowers();
    res.status(200).json(followers);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// GET /user/followings - 내가 팔로잉한 사람 목록 가져오기
router.get("/followings", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } }); // 나를 먼저 찾고
    if (!user) {
      res.status(403).send("존재하지 않는 유저입니다.");
    }
    const followings = await user.getFollowings();
    res.status(200).json(followings);
  } catch (err) {
    console.error(err);
    next(err);
  }
});
```

`pages/profile.js`

```jsx
import { LOAD_FOLLOWERS_REQUEST, LOAD_FOLLOWINGS_REQUEST } from "../reducers/user";

const Profile = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: LOAD_FOLLOWERS_REQUEST });
    dispatch({ type: LOAD_FOLLOWINGS_REQUEST });
  }, []);

  return <> {/* codes.. */} </>;
};

export default Profile;
```

위와 같이 컴포넌트에 팔로잉, 팔로워 목록을 가져오는 dispatch 이벤트를 추가해줬다면 이제 실제 액션함수들을 구현하는 일이 남았다. (매우 반복적인 일이므로 해당 코드를 줄이는 방법에 대해 다음 회차에 알아보자!)

`reducers/user.js`

```jsx
import produce from "immer";
export const initialState = {
  loadFollowingsLoading: false, // 팔로잉 목록 가져오기 시도중
  loadFollowingsDone: false,
  loadFollowingsError: null,
  loadFollowersLoading: false, // 팔로워 목록 가져오기 시도즁
  loadFollowersDone: false,
  loadFollowersError: null,
};

export const LOAD_FOLLOWINGS_REQUEST = "LOAD_FOLLOWINGS_REQUEST";
export const LOAD_FOLLOWINGS_SUCCESS = "LOAD_FOLLOWINGS_SUCCESS";
export const LOAD_FOLLOWINGS_FAILURE = "LOAD_FOLLOWINGS_FAILURE";

export const LOAD_FOLLOWERS_REQUEST = "LOAD_FOLLOWERS_REQUEST";
export const LOAD_FOLLOWERS_SUCCESS = "LOAD_FOLLOWERS_SUCCESS";
export const LOAD_FOLLOWERS_FAILURE = "LOAD_FOLLOWERS_FAILURE";

const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case LOAD_FOLLOWINGS_REQUEST:
        draft.loadFollowingsLoading = true;
        draft.loadFollowingsDone = false;
        draft.loadFollowingsError = null;
        break;
      case LOAD_FOLLOWINGS_SUCCESS:
        draft.loadFollowingsLoading = false;
        draft.loadFollowingsDone = true;
        draft.me.Followings = action.data;
        break;
      case LOAD_FOLLOWINGS_FAILURE:
        draft.loadFollowingsLoading = false;
        draft.loadFollowingsError = action.error;
        break;
      case LOAD_FOLLOWERS_REQUEST:
        draft.loadFollowersLoading = true;
        draft.loadFollowersDone = false;
        draft.loadFollowersError = null;
        break;
      case LOAD_FOLLOWERS_SUCCESS:
        draft.loadFollowersLoading = false;
        draft.loadFollowersDone = true;
        draft.me.Followers = action.data;
        break;
      case LOAD_FOLLOWERS_FAILURE:
        draft.loadFollowersLoading = false;
        draft.loadFollowersError = action.error;
        break;
      default:
        break;
    }
  });

export default reducer;
```

`sagas/user.js`

```jsx
import {
  LOAD_FOLLOWINGS_REQUEST,
  LOAD_FOLLOWINGS_SUCCESS,
  LOAD_FOLLOWINGS_FAILURE,
  LOAD_FOLLOWERS_REQUEST,
  LOAD_FOLLOWERS_SUCCESS,
  LOAD_FOLLOWERS_FAILURE,
} from "../reducers/user";

function loadFollowersAPI(data) {
  return axios.get(`/user/followers`, data);
}
function* loadFollowers(action) {
  try {
    const result = yield call(loadFollowersAPI, action.data);
    yield put({
      type: LOAD_FOLLOWERS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: LOAD_FOLLOWERS_FAILURE,
      error: err.response.data,
    });
  }
}

function loadFollowingsAPI(data) {
  return axios.get(`/user/followings`, data);
}
function* loadFollowings(action) {
  try {
    const result = yield call(loadFollowingsAPI, action.data);
    yield put({
      type: LOAD_FOLLOWINGS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: LOAD_FOLLOWINGS_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchLoadFollowers() {
  yield takeLatest(LOAD_FOLLOWERS_REQUEST, loadFollowers);
}
function* watchLoadFollowings() {
  yield takeLatest(LOAD_FOLLOWINGS_REQUEST, loadFollowings);
}

export default function* userSaga() {
  yield all([
    fork(watchLoadFollowers),
    fork(watchLoadFollowings),
    // another forks...
  ]);
}
```

위와 같이 데이터를 구현해주면 실제 프로필 페이지에서 팔로잉 팔로워 리스트가 정상적으로 노출되는 것을 확인할 수 있다. 이번엔 팔로잉 목록에 추가한 유저를 삭제처리 해본다!!

`/components/FollowList.js`

```jsx
import { UNFOLLOW_REQUEST, REMOVE_FOLLOWER_REQUEST } from "../reducers/user";

const FollowList = ({ header, data }) => {
  const dispatch = useDispatch();
  const onCancel = (id) => () => {
    if (header === "팔로잉") {
      dispatch({
        type: UNFOLLOW_REQUEST,
        data: id,
      });
      return;
    }
    // 팔로워를 차단하는 액션
    dispatch({
      type: REMOVE_FOLLOWER_REQUEST,
      data: id,
    });
  };

  return (
    <List
      // settings for List ..
      renderItem={(item) => (
        <List.Item style={renderListStyle}>
          <Card actions={[<StopOutlined key="stop" onClick={onCancel(item.id)} />]}>
            <Card.Meta description={item.nickname} />
          </Card>
        </List.Item>
      )}
    />
  );
};

export default FollowList;
```

위 코드를 보면 onCancel 이벤트에 `UNFOLLOW_REQUEST` 액션을 dispatch하여 팔로잉 목록에서 유저를 삭제해준다. 그렇다면 팔로워를 차단하는 액션은 어떻게 할까? 내가 아닌 타인이 나를 팔로워했을 때 이를 차단하려면 위 `UNFOLLOW_REQUEST` 하위 코드처럼 별도의 `REMOVE_FOLLOWER_REQUEST`라는 액션이 필요하다!

`reducers/user.js`

```jsx
export const initialState = {
  removeFollowerLoading: false, // 팔로워 차단 시도중
  removeFollowerDone: false,
  removeFollowerError: null,
};

export const REMOVE_FOLLOWER_REQUEST = "REMOVE_FOLLOWER_REQUEST";
export const REMOVE_FOLLOWER_SUCCESS = "REMOVE_FOLLOWER_SUCCESS";
export const REMOVE_FOLLOWER_FAILURE = "REMOVE_FOLLOWER_FAILURE";

const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case REMOVE_FOLLOWER_REQUEST:
        draft.removeFollowerLoading = true;
        draft.removeFollowerDone = false;
        draft.removeFollowerError = null;
        break;
      case REMOVE_FOLLOWER_SUCCESS:
        draft.removeFollowerLoading = false;
        draft.removeFollowerDone = true;
        draft.me.Followers = draft.me.Followers.filter((v) => v.id !== action.data.UserId);
        break;
      case REMOVE_FOLLOWER_FAILURE:
        draft.removeFollowerLoading = false;
        draft.removeFollowerError = action.error;
        break;
      default:
        break;
    }
  });

export default reducer;
```

`sagas/user.js`

```jsx
import {
  REMOVE_FOLLOWER_REQUEST,
  REMOVE_FOLLOWER_SUCCESS,
  REMOVE_FOLLOWER_FAILURE,
} from "../reducers/user";

function removeFollowerAPI(data) {
  return axios.delete(`/user/follower/${data}`);
}
function* removeFollower(action) {
  try {
    const result = yield call(removeFollowerAPI, action.data);
    yield put({
      type: REMOVE_FOLLOWER_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: REMOVE_FOLLOWER_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchRemoveFollower() {
  yield takeLatest(REMOVE_FOLLOWER_REQUEST, removeFollower);
}

export default function* userSaga() {
  yield all([
    fork(watchRemoveFollower),
    // another forks...
  ]);
}
```

🤪 마지막으로 API routes만 추가해준다!

`routes/user.js`

내가 팔로워를 차단하는 것과 팔로워가 나를 삭제하는 것과 같은 의미이므로 아래처럼 routes를 설계할 수 있다.

```jsx
// DELETE /user/follower/1
router.delete("/follower/:userId", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.params.userId } }); // 그 사람을 먼저 찾고
    if (!user) {
      res.status(403).send("존재하지 않는 유저입니다."); // 없는 사람을 차단하려고 함!
    }
    await user.removeFollowings(req.user.id);
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
  } catch (err) {
    console.error(err);
    next(err);
  }
});
```

이렇게 해준 뒤 브라우저에서 팔로워를 삭제해주면 성공적으로 처리된다!

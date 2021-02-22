# 게시글 삭제 saga 구현

## 새롭게 만든

immer를 배우기 전에 게시글 삭제 saga를 만들어보자. 먼저 UserProfile 컴포넌트에 팔로잉, 팔로워를 위한 더미데이터를 작성한다.

```jsx
const dummyUser = (data) => ({
  ...data,
  nickname: "vicky",
  id: 1,
  Posts: [{ id: 1 }],
  Followings: [{ nickname: "heezi" }, { nickname: "zini" }, { nickname: "Soo" }],
  Followers: [{ nickname: "heezi" }, { nickname: "zini" }, { nickname: "Soo" }],
});
```

위와 같이 데이터를 넣어주면 로그인 후 짹짹, 팔로잉, 팔로워의 숫자가 변경되는 것을 확인할 수 있다.

그런데 하나 생각해볼 문제가 있다. 만약 `PostCard`를 통해 데이터를 추가할 경우 해당 데이터를 post 리듀서는 파악할 수 있으나 user 리듀서는 인지하지 못한다. 따라서 짹짹의 숫자는 변경되지 않는 것이다. 그 이유는 관리하는 데이터가 분리되어 있기 때문으로, 우리는 여태 post 데이터는 post에서, user 데이터는 user 데이터에서 분리해서 관리해왔다. 만약 post 데이터의 변경으로 user 데이터의 값도 업데이트되어야 할 경우 어떻게 하는 것이 좋을까?

바로 user리듀서에서 자신의 데이터 값을 업데이트하는 액션을 생성하여 Export하고 이를 user saga에서 함께 실행해주면 된다.

`/reducers/user.js`

```jsx
// 상태를 바꿀 수 있는 액션을 별도로 만들어준다.
export const ADD_POST_TO_ME = "ADD_POST_TO_ME";
export const REMOVE_POST_OF_ME = "REMOVE_POST_OF_ME";

const reducer = (state = initialState, action) => {
	case ADD_POST_TO_ME:
      return {
        ...state,
        me: {
          ...state.me,
          Posts: [{ id: action.data }, ...state.me.Posts],
        },
      };
	// code..
};
```

`/sagas/post.js`

```jsx
function* addPost(action) {
  try {
    // const result = yield call(addPostAPI, action.data);
    yield delay(1000);
    const id = shortid.generate();
    yield put({
      type: ADD_POST_SUCCESS,
      data: {
        id,
        content: action.data,
      },
    });
    // ADD_POST_TO_ME 액션을 추가로 실행
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
```

`/reducers/posts.js`

```jsx
const dummyPost = (data) => ({
  id: data.id, // update!
  content: data.content, // update!
  User: {
    id: 1,
    nickname: "비키",
  },
  Images: [],
  Comments: [],
});
```

이렇게 서로 분리되어 있는 데이터를 한번에 업데이트하는 과정에 대해 확인했다.

## 게시글 삭제 saga 구현하기

`/reducers/post.js`

```jsx
export const initialState = {
	// ...codes
  removePostLoading: false,
  removePostDone: false,
  removePostError: null,
};

export const REMOVE_POST_REQUEST = "REMOVE_POST_REQUEST";
export const REMOVE_POST_SUCCESS = "REMOVE_POST_SUCCESS";
export const REMOVE_POST_FAILURE = "REMOVE_POST_FAILURE";

export const reducer = (state = initialState, action) => {
	case REMOVE_POST_REQUEST:
      return {
        ...state,
        removePostLoading: true,
        removePostDone: false,
        removePostError: null,
      };
    case REMOVE_POST_SUCCESS:
      return {
        ...state,
        mainPosts: state.mainPosts.filter((v) => v.id !== action.data),
        removePostLoading: false,
        removePostDone: true,
      };
    case REMOVE_POST_FAILURE:
      return {
        ...state,
        removePostLoading: false,
        removePostError: action.error,
      };
}
export default reducer;
```

`/sagas/post.js`

```jsx
import { all, fork, delay, put, takeLatest } from "redux-saga/effects";
import shortid from "shortid";
import axios from "axios";
import { REMOVE_POST_REQUEST, REMOVE_POST_SUCCESS, REMOVE_POST_FAILURE } from "../reducers/post";
import { ADD_POST_TO_ME, REMOVE_POST_OF_ME } from "../reducers/user";

function removePostAPI(data) {
  return axios.post("/api/post", data);
}
function* removePost(action) {
  try {
    // const result = yield call(removePostAPI, action.data);
    yield delay(1000);
    const id = shortid.generate();
    yield put({
      type: REMOVE_POST_SUCCESS,
      data: action.data,
    });
    yield put({
      type: REMOVE_POST_OF_ME,
      data: action.data,
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
  yield all([/* ...anothers */ fork(watchRemovePost)]);
}
```

액션을 모두 생성했으니 이제 PostCard에서 삭제 기능을 추가해보자. removePostLoading 값도 추가한다.

`/Components/PostCard.js`

```jsx
const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const { removePostLoading } = useSelecter((state) => state.post);
  // action dispatch
  const onRemovePost = useCallback(
    () => dispatch({ type: REMOVE_POST_REQUEST, data: post.id }),
    []
  );

  return (
    <div style={{ marginBottom: 20 }}>
      <Card
        cover={post.Images[0] && <PostImages images={post.Images} />}
        actions={[
          <RetweetOutlined key="retweet" />,
          liked ? (
            <HeartTwoTone twoToneColor="#eb2f96" key="heart" onClick={onToggleLike} />
          ) : (
            <HeartOutlined key="heart" onClick={onToggleLike} />
          ),
          <MessageOutlined key="comment" onClick={onToggleComment} />,
          <Popover
            key="more"
            content={
              <Button.Group>
                {id && post.User.id === id ? (
                  <>
                    <Button>수정</Button>
                    <Button type="danger" loading={removePostLoading} onClick={onRemovePost}>
                      삭제
                    </Button>
                  </>
                ) : (
                  <Button>신고</Button>
                )}
              </Button.Group>
            }
          >
            <EllipsisOutlined />
          </Popover>,
        ]}
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
```

위와 같이 설정하면 컴포넌트 내 게시글 삭제 기능이 잘 구현되는 것을 확인할 수 있다.

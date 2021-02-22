# 인피니트 스크롤링 적용하기

여태껏 더미데이터로 게시글을 넣어뒀다. nodeBird의 특성상 데이터가 무한 생성되는 인피니트 스크롤링이 적용되어야 하므로 기존의 데이터를 삭제한 뒤 더미데이터를 호출하는 loadPostsRequest라는 액션을 구현해보자.

먼저 기존 initialState에 있던 mainPosts 더미데이터를 빈 배열로 바꿔준 뒤 이전 시간에 faker와 shortid로 구현했던 더미데이터를 함수로 변경해줘야 한다.

`/reducers/post.js`

```jsx
export const initialState = {
  mainPosts: [],
  imagePaths: [],
  // ...
};

// 더미 posts 데이터 생성함수
export const generateDummyPost = (number) =>
  Array(number)
    .fill()
    .map(() => ({
      id: shortid.generate(),
      User: {
        id: shortid.generate(),
        nickname: faker.name.findName(),
      },
      content: faker.lorem.paragraph(),
      Images: [
        {
          src: faker.image.image(),
        },
      ],
      Comments: [
        {
          User: {
            id: shortid.generate(),
            nickname: faker.name.findName(),
          },
          content: faker.lorem.sentence(),
        },
      ],
    }));

// initialState.mainPosts에 붙여넣기, 이후에 saga에서 처리
initialState.mainPosts = initialState.mainPosts.concat(generateDummyPost(10));
```

그리고 post.js에 LOAD_POSTS 액션을 생성해준다.

```jsx
export const LOAD_POSTS_REQUEST = "LOAD_POSTS_REQUEST";
export const LOAD_POSTS_SUCCESS = "LOAD_POSTS_SUCCESS";
export const LOAD_POSTS_FAILURE = "LOAD_POSTS_FAILURE";
```

`/pages/index.js`

이후 데이터 호출을 index.js의 componentDidMount 시점에서 request처리해준다.

```jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LOAD_POSTS_REQUEST } from "../reducers/post";

const Home = () => {
  // ...codes

  const dispatch = useDispatch();
  // componentDidMount 시점에서 LOAD_POSTS_REQUEST 호출
  useEffect(() => {
    dispatch({
      type: LOAD_POSTS_REQUEST,
    });
  }, []);

  return <AppLayout>{/* ...codes */}</AppLayout>;
};

export default Home;
```

이제 상세한 LOAD_POSTS 액션을 처리해본다.

`/reducers/post.js`

```jsx
export const initialState = {
  mainPosts: [],
  hasMorePost: true, // 가져올 데이터가 더 있는지 확인하는 state 추가
};

export const LOAD_POSTS_REQUEST = "LOAD_POSTS_REQUEST";
export const LOAD_POSTS_SUCCESS = "LOAD_POSTS_SUCCESS";
export const LOAD_POSTS_FAILURE = "LOAD_POSTS_FAILURE";

const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case LOAD_POSTS_REQUEST:
        draft.loadPostsLoading = true;
        draft.loadPostsDone = false;
        draft.loadPostsError = null;
        break;
      case LOAD_POSTS_SUCCESS:
        draft.mainPosts = action.data.concat(draft.mainPosts);
        draft.loadPostsLoading = false;
        draft.loadPostsDone = true;
        draft.hasMorePost = draft.mainPosts.length < 50; // 50개 이상으로는 데이터를 더 가져오지 않겠다.
        break;
      case LOAD_POSTS_FAILURE:
        draft.loadPostsLoading = false;
        draft.loadPostsError = action.error;
        break;
      // ...codes
    }
  });
```

`/sagas/post.js`

스크롤 이벤트가 동시다발적으로 발생하므로 throttle saga 이펙트를 적용해준다! 요청은 여러번하나 응답은 설정시간 내 1번만 한다.

```jsx
import {
  LOAD_POSTS_REQUEST,
  LOAD_POSTS_SUCCESS,
  LOAD_POSTS_FAILURE,
  generateDummyPost,
} from "../reducers/post";

function loadPostsAPI(data) {
  return axios.get("/api/post", data);
}
function* loadPosts(action) {
  try {
    // const result = yield call(loadPostsAPI, action.data);
    yield delay(1000);
    const id = shortid.generate();
    yield put({
      type: LOAD_POSTS_SUCCESS,
      data: generateDummyPost(10), // action.data에 더미데이터를 넣어준다.
    });
  } catch (err) {
    yield put({
      type: LOAD_POSTS_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchLoadPosts() {
  yield throttle(5000, LOAD_POSTS_REQUEST, loadPosts);
}

export default function* postSaga() {
  yield all([
    fork(watchLoadPosts), // ...
  ]);
}
```

`LOAD_POST`에 대한 액션은 모두 처리되었다. 이제 실제 index.js에서 스크롤이 끝에 닿았을 때 액션 dispatch를 구현해주면 된다! 어떻게 구현하면 될까? 방법론에 대해 한번 더 생각해본 후 아래 내용을 살펴보자

`/pages/index.js`

```jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppLayout from "../components/AppLayout";
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import { LOAD_POSTS_REQUEST } from "../reducers/post";

const Home = () => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  // 1. hasMorePost와 loadPostsLoading으로 데이터 추가 로드에 대한 조건값 호출
  const { mainPosts, hasMorePosts, loadPostsLoading } = useSelector((state) => state.post);

  // 2. 초기 LOAD_POSTS
  useEffect(() => {
    dispatch({
      type: LOAD_POSTS_REQUEST,
    });
  }, []);

  // 3. 인피니트 스크롤 LOAD_POSTS
  useEffect(() => {
    function onScroll() {
      if (
        window.scrollY + document.documentElement.clientHeight >
        document.documentElement.scrollHeight - 300
      ) {
        if (hasMorePosts && !loadPostsLoading) {
          dispatch({
            type: LOAD_POSTS_REQUEST,
          });
        }
      }
    }
    window.addEventListener("scroll", onScroll);
    // 4. Return event
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [hasMorePost, loadPostsLoading]);

  return (
    <AppLayout>
      {me && <PostForm />}
      {mainPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </AppLayout>
  );
};

export default Home;
```

1. hasMorePost라는 트리거 state를 useSelector로 불러와 추가 데이터 호출을 제어한다.
2. useEffect에 빈배열을 두번째 인자를 주어 초기 loadPosts Action을 구현한다.
3. hasMorePost 트리거를 구독하는 useEffect 훅에 스크롤 끝 부분에 다 다랐다는 것을 체크하여 loadPosts Actions을 실행시키는 함수를 구현한다.

   ```
   // 끝까지 다 내렸다는 것을 체크
   window.scrollY(얼마나 내렸는지 스크롤 위치)
    + document.documentElement.clientHeight(화면 보이는 길이)
   		= document.documentElement.scrollHeight (총 화면 길이)
   ```

4. `useEffect`에서 window.addEventListener 메서드를 사용할 때 항상 주의해야하는 것은 위와 같이 `Return`으로 removeEventListener로 이벤트를 삭제해주어야 한다. 그러지 않으면 메모리에 계속 쌓이므로 장기적인 성능 저하의 원인이 된다.

### [react-virtualized](https://github.com/bvaughn/react-virtualized)

무한 스크롤 이벤트로 게시글을 몇 천개를 본다면 모바일 환경일 경우 메모리가 터질 위험이 있다. 이 때 사용하는 패키지가 react-virtualized이다. 실제 인스타그램의 경우 화면에 3-4개의 데이터만 보여주므로 나머지는 뒤의 메모리가 보관하고 있다가 스크롤에 따라 돔 렌더링을 해주는 방식으로 구현하고 있다. 이렇게 하면 메모리가 터질 위험없이 서비스를 운영할 수 있다.

프론트엔드 개발자의 경우 백엔드의 구성보다는 이렇게 막대한 양의 데이터를 어떻게 핸들링하고 문제없이 서비스에 녹여내는지를 고민하고 역량을 보여줄 수 있는 것이 가장 중요하다!

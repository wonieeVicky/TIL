# 게시글, 댓글 saga로 구현하기

이제 본격적으로 saga를 사용하여 코딩을 해보는 시간이다. 우리는 이제 모든 action을 리듀서와 saga에 넣어두었다. 때문에 화면에 어떤 문제가 발생했을 때 reducer와 saga를 먼저 확인하여 데이터가 어떻게 동작하는지 먼저 확인해야 한다.

먼저 게시글을 추가하면 반복문 안의 반복문 컴포넌트인 PostCard에 key props이 중복된다는 에러가 발생한다. 이 이유는 더미데이터 안의 id값이 2로 고정되어있고, id값으로 분류해도 오류가 발생할 가능성이 있는 상태.

이때는 유용한 패키지인 shortId를 사용하면 매우 편리한데, 패키지를 설치 후 적용해보자

```bash
$ npm i shortid
```

이후 더미데이터를 넣는 reducers/post.js의 dummyPost에 shortId를 적용해준다. 아이디 정합이 애매할 경우 shortId를 사용하면 좋다.

```jsx
import shortid from "shortid";

const dummyPost = (data) => ({
  id: shortid.generate(),
  content: data,
  User: {
    id: 1,
    nickname: "비키",
  },
  Images: [],
  Comments: [],
});

// codes...
```

이제 comment를 추가하는 액션을 보강해본다. 먼저 Comment의 경우 initialState에서보면 mainPosts 배열 안의 Comments 로 배열 데이터로 추가된다. 이러한 데이터를 불변성을 지키며 업데이트 해주는 것은 굉장히 복잡하다. 우선 전개연산자를 활용하여 addComment 함수를 구현해보자.

```jsx
import shortid from "shortid";

export const initialState = {};

export const ADD_COMMENT_REQUEST = "ADD_COMMENT_REQUEST";
export const ADD_COMMENT_SUCCESS = "ADD_COMMENT_SUCCESS";
export const ADD_COMMENT_FAILURE = "ADD_COMMENT_FAILURE";

export const addComment = (data) => ({
  type: ADD_COMMENT_REQUEST,
  data,
});
const dummyComment = (data) => ({
  id: shortid.generate(),
  content: data,
  User: {
    id: 1,
    nickname: "wonny",
  },
});

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_COMMENT_SUCCESS: {
      // action.data로 content와 postId, userId가 온다.
      const postIndex = state.mainPosts.findIndex((v) => v.id === action.data.postId);
      const post = { ...state.mainPosts[postIndex] };
      post.Comments = [dummyComment(action.data.content), ...post.Comments];
      const mainPosts = [...state.mainPosts];
      mainPosts[postIndex] = post;

      return {
        ...state,
        mainPosts,
        addCommentLoading: false,
        addCommentDone: true,
      };
    }
    default:
      return state;
  }
};

export default reducer;
```

먼저 불변성의 핵심은 바뀌는 것만 새로운 것으로 만들고, 나머지는 참조를 유지해줘야하는 것이다.
그렇게 해야지만 메모리를 절약할 수 있다. 위와 같이 전개연산자를 사용해 data의 불변성을 지키며 업데이트를 했지만 우리는 불안하다. 정확히 수정할 부분만 변경한 것인지 의심스러울 때가 많은 것이다.
만약 데이터가 매우 긴 형태의 정보라면 다루는 데이터가 많아질 수록 불확실성이 더 높아진다.
이럴 때 효율적인 패키지가 바로 immer이다. 다음 시간에는 immer를 통해 불변성 관리를 좀 더 효율적으로 하는 방법을 배워보자!

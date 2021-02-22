# 리듀서에 immer 적용하기

## 리듀서에 immer 구현

지난 코딩을 통해 리액트 프로젝트에서 상태관리와 히스토리를 위한 객체 불변성을 유지해야 하는 필요성에 대해서 인식했다. 또한 전개연산자를 통해 상태를 업데이트 해봄으로써 불변성을 유지하는 것에 대한 어려움을 경험해보았다. 조금만 실수해도 데이터가 유실되어버리기 때문에 이러한 점을 개선하기 위해 immer라는 패키지를 설치하여 적용해보자.

기존에는 immutable이라는 패키지가 있어서 그걸 사용했지만 좀 더 편리한 패키지 도구인 immer를 주로 사용한다. 훅 버전은 use-immer라는 커스텀 훅도 있다.

```bash
$ npm i immer
```

immer를 적용하기 전에 리듀서의 역할에 대해 한번 더 상기해보자면..

**Reducer는 이전 상태를 액션을 통해 다음 상태로 만드는 함수로 반드시 불변성을 지켜주어야 한다.**

immer는 reducer에서 아래와 같이 적용한다.
immer가 알아서 불변성을 유지해주므로 필요한 데이터를 바꾸는 것에만 집중하면 된다.
코드가 훨씬 명료하게 변경되는 것을 확인할 수 있다. 초기 MVP단계에서부터 적용하면 효율성을 처음부터 높이면서 작업할 수 있다. (개발자는 얼마나 효율적으로 코드를 짜서 시간을 아끼느냐가 가장 중요한 능력이다)

`/reducers/post.js`

```jsx
import produce from "immer";

const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case ADD_POST_REQUEST:
        draft.addPostLoading = true;
        draft.addPostDone = false;
        draft.addPostError = null;
        break;
      case ADD_POST_SUCCESS:
        draft.mainPosts.unshift(dummyPost(action.data));
        draft.addPostLoading = false;
        draft.addPostDone = true;
        break;
      case ADD_POST_FAILURE:
        draft.addPostLoading = false;
        draft.addPostError = action.error;
        break;
      case REMOVE_POST_REQUEST:
        draft.removePostLoading = true;
        draft.removePostDone = false;
        draft.removePostError = null;
        break;
      case REMOVE_POST_SUCCESS:
        draft.mainPosts = draft.mainPosts.filter((v) => v.id !== action.data);
        draft.removePostLoading = false;
        draft.removePostDone = true;
        break;
      case REMOVE_POST_FAILURE:
        draft.removePostLoading = false;
        draft.removePostError = action.error;
        break;
      case ADD_COMMENT_REQUEST:
        draft.addCommentLoading = true;
        draft.addCommentDone = false;
        draft.addCommentError = null;
        break;
      case ADD_COMMENT_SUCCESS: {
        const post = draft.mainPosts.find((v) => v.id === action.data.postId);
        post.Comments.unshift(dummyComment(action.data.content));
        draft.addCommentLoading = false;
        draft.addCommentDone = true;
        break;
      }
      case ADD_COMMENT_FAILURE:
        draft.addCommentLoading = false;
        draft.addCommentError = action.error;
        break;
      default:
        break;
    }
  });

export default reducer;
```

`/reducers/user.js`

```jsx
import produce from "immer";
const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case LOG_IN_REQUEST:
        draft.logInLoading = true;
        draft.logInDone = false;
        draft.logInError = null;
        break;
      case LOG_IN_SUCCESS:
        draft.logInLoading = false;
        draft.logInDone = true;
        draft.me = dummyUser(action.data);
        break;
      case LOG_IN_FAILURE:
        draft.logInLoading = false;
        draft.logInError = action.error;
        break;
      case LOG_OUT_REQUEST:
        draft.logOutLoading = true;
        draft.logOutDone = false;
        draft.logOutError = null;
        break;
      case LOG_OUT_SUCCESS:
        draft.logOutLoading = false;
        draft.logOutDone = true;
        draft.me = null;
        break;
      case LOG_OUT_FAILURE:
        draft.logOutLoading = false;
        draft.logOutError = action.error;
        break;
      case SIGN_UP_REQUEST:
        draft.signUpLoading = true;
        draft.signUpDone = false;
        draft.signUpError = null;
        break;
      case SIGN_UP_SUCCESS:
        draft.signUpLoading = false;
        draft.signUpDone = true;
        break;
      case SIGN_UP_FAILURE:
        draft.signUpLoading = false;
        draft.signUpError = action.error;
        break;
      case CHANGE_NICKNAME_REQUEST:
        draft.changeNicknameLoading = true;
        draft.changeNicknameDone = false;
        draft.changeNicknameError = null;
        break;
      case CHANGE_NICKNAME_SUCCESS:
        draft.changeNicknameLoading = false;
        draft.changeNicknameDone = true;
        break;
      case CHANGE_NICKNAME_FAILURE:
        draft.changeNicknameLoading = false;
        draft.changeNicknameError = action.error;
        break;
      case ADD_POST_TO_ME:
        draft.me.Posts.unshift({ id: action.data });
        break;
      case REMOVE_POST_OF_ME:
        draft.me.Posts = draft.me.Posts.filter((v) => v.id !== action.data);
        break;
      default:
        break;
    }
  });

export default reducer;
```

## reducer에 faker로 더미데이터 구현하기

```bash
$ npm i faker
```

가짜 이름도 많이 만들다보면 그것만으로 멋이 안난다. 이때 자주 사용하는 것이 faker 패키지다 :)

```jsx
import faker from "faker";

initialState.mainPosts = initialState.mainPosts.concat(
  Array(20)
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
    }))
);
```

위처럼 mainPosts에 대한 더미데이터를 넣어주면 훨씬 nodeBird와 가까운 멋스러운 레이아웃 구현이 가능하다. faker뿐만 아니라 [placeholder.co](http://placeholder.co.kr)m 과 [lorempixel.com](http://lorempixel.com) 을 활용해도 괜찮은 더미데이터를 구현할 수 있다.

### 참고

[redux-toolkit](https://redux-toolkit.js.org/usage/usage-guide)을 통해 더 적절히 redux를 운용할 수 있는 방법도 다시 알아보자.

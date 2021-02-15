# 더미데이터와 포스트폼 만들기

user.js에서 로그인, 로그아웃을 구현해봤다면 post.js에서 게시글 관련 액션을 구현해볼 차례이다.

먼저 아직 백엔드에서 내려주는 response가 만들어지지 않은 상태라고 가정하므로 더미데이터(initialState)를 만들어 해당 로직을 바탕으로 화면을 먼저 구현한다. 더미데이터를 받을 때는 백엔드 개발자와 미리 협의하여 Response 구조에 대해 협의하는 것이 좋다. (이후 전혀 다른 구조의 response를 받게된다면 변경해줘야하는 부분이 너무 많으므로)

`/reducers/post.js`

```jsx
export const initialState = {
  // 1. mainPosts 더미데이터
  mainPosts: [
    {
      id: 1,
      User: {
        id: 1,
        nickname: "vicky",
      },
      content: "첫 번째 게시글 #해시태그 #익스프레스",
      Images: [
        {
          src: "https://img-cf.kurly.com/shop/data/board/recipe/m/main_v2_9c7715d77c3a7667.jpg",
        },
        {
          src: "https://img-cf.kurly.com/shop/data/board/recipe/m/main_v2_70707728dc9e7eab.jpg",
        },
        {
          src: "https://img-cf.kurly.com/shop/data/board/recipe/m/main_v2_6341580e2dae2d31.jpg",
        },
      ],
      Comments: [
        {
          User: {
            nickname: "wonny",
          },
          content: "와 맛있겠다... 먹고싶어여!",
        },
        {
          User: {
            nickname: "joy",
          },
          content: "요리사가 만든 것 같아요! 레시피는 어디서 보셨나요?",
        },
      ],
    },
  ],
  imagePths: [],
  postAdded: false,
};

// 2. 액션 타입: 상수 처리
const ADD_POST = "ADD_POST";

export const addPost = {
  type: ADD_POST,
};

const dummyPost = {
  id: 2,
  content: "더미데이터입니다.",
  User: {
    id: 1,
    nickname: "비키",
  },
  Images: [],
  Comments: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_POST:
      return {
        ...state,
        mainPosts: [dummyPost, ...state.mainPosts], // 3. 새로운 데이터를 앞에 정렬
        postAdded: true,
      };
    default:
      return state;
  }
};

export default reducer;
```

1. 먼저 post의 InitialState의 mainPost 내 더미데이터를 넣어준다.
   더미데이터 배열 내 객체 키 값을 보면 어떤 것은 소문자, 어떤 것은 대문자로 되어있다.
   (id, content는 소문자이고, User, Images, Comments는 대문자)
   이는 DB 시퀄라이즈에서는 어떤 정보가 다른 정보와의 관계로 인해 합쳐져서 나올 경우 앞 글자가 대문자가 되어 반환하기 때문이다. 즉, id, content는 데이터가 합쳐지지 않는 게시글 자체의 속성이므로 소문자로 반환되며, User, Images, Comments는 다른 정보와 합쳐지므로 대문자로 반환되는 것이다.
   물론 백엔드에서 response에 균일하게 맞춰줄 수도 있으나 우선 그대로 반환된다는 정의하에 작업한다.
2. 액션 타입을 상수값으로 정의하면, 중간에 오타가 나는 일이 없고, 값 변경 시 효율적이다.
3. 새로운 데이터를 앞에 정렬한 것은 앞에 추가해야 게시글이 최상 위에 업데이트 되기 때문이다.

---

자, 이제 post reducer에 대한 작업을 마쳤으니 해당 내용을 바탕으로 컴포넌트를 구현해보자.
먼저 pages의 `Index.js`에서 컴포넌트를 어떻게 분리할 것인지를 먼저 고민하고 자식 컴포넌트를 먼저 생성한다. 2가지의 기능이 필요한데 첫 번째, 게시글 기능으로 로그인 후 게시글을 작성할 수 있는 `PostForm` 컴포넌트와 두 번쨰, 입력 시 추가되는 `PostCard` 컴포넌트가 필요하다

`/pages/index.js`

```jsx
import { useSelector } from "react-redux";
import AppLayout from "../components/AppLayout";
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";

const Home = () => {
  const { isLoggedIn } = useSelector((state) => state.user);
  const { mainPosts } = useSelector((state) => state.post);

  return (
    <AppLayout>
      {isLoggedIn && <PostForm />}
      {mainPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </AppLayout>
  );
};

export default Home;
```

`/components/PostForm.js`

인라인으로 배치된 스타일 요소를 styled-components나 useMemo로 별도로 분리할 것을 권장하였으나 빠른 mvp단계에서는 우선 인라인으로 배치한 뒤 개선하는 방향으로 업무를 하는 것이 효율적이다.
useSelector로 필요한 데이터를 가져오고 useDispatch를 활용해 액션을 실행시키며, useRef, useState를 통해 돔 내부의 데이터를 변경해주는 방식으로 아래와 같이 구현했다.

```jsx
import { useCallback, useState, useRef } from "react";
import { Button, Form, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { addPost } from "../reducers/post";

const PostForm = () => {
  const { imagePaths } = useSelector((state) => state.post);
  const dispatch = useDispatch();
  const imageInput = useRef();
  const [text, setText] = useState("");

  const onChangeText = useCallback((e) => setText(e.target.value), []);
  const onSubmit = useCallback(() => {
    dispatch(addPost);
    setText("");
  }, []);
  const onClickImageUpload = useCallback(() => imageInput.current.click(), [imageInput.current]);

  return (
    <Form style={{ margin: "10px 0 20px" }} encType="multipart/form-data" onFinish={onSubmit}>
      <Input.TextArea
        value={text}
        onChange={onChangeText}
        maxLength={140}
        placeholder="오늘은 어떤 맛있는 것을 드셨나요?"
      />
      <div>
        <input type="file" multiple hidden ref={imageInput} />
        <Button onClick={onClickImageUpload}>이미지 업로드</Button>
        <Button type="primary" style={{ float: "right" }} htmlType="submit">
          짹짹
        </Button>
      </div>
      <div>
        {imagePaths.map((v) => (
          <div key={v} style={{ display: "inline-block" }}>
            <img src={v} style={{ width: 200 }} alt={v} />
            <div>
              <Button>제거</Button>
            </div>
          </div>
        ))}
      </div>
    </Form>
  );
};

export default PostForm;
```

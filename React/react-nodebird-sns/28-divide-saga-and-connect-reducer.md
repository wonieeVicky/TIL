# saga 분리와 reducer 연결

thunk도 그렇지만 액션이 들어날수록 이벤트들의 코드가 매우 길어진다. 이럴 때에는 쪼개야 한다!

`/sagas/index.js`

```jsx
import { all, fork } from "redux-saga/effects";

import postSaga from "./post";
import userSaga from "./user";

// merge sagas
export default function* rootSaga() {
  yield all([fork(postSaga), fork(userSaga)]);
}
```

`/sagas/userSaga.js`

우선 userSaga부터 분리해보자!

```jsx
import { all, fork, delay, put, takeLatest } from "redux-saga/effects";
import axios from "axios";

function* watchLogin() {
  yield takeLatest("LOG_IN_REQUEST", logIn);
}
function* watchLogOut() {
  yield takeLatest("LOG_OUT_REQUEST", logOut);
}

function logInAPI(data) {
  return axios.post("/api/login", data);
}
function* logIn(action) {
  try {
    // const result = yield call(logInAPI, action.data, "a", "b", "c");
    yield delay(1000);
    yield put({
      type: "LOG_IN_SUCCESS",
      data: action.data,
    });
  } catch (err) {
    yield put({
      type: "LOG_IN_FAILURE",
      data: err.response.data,
    });
  }
}

function logOutAPI() {
  return axios.post("/api/logout");
}
function* logOut() {
  try {
    // const result = yield call(logOutAPI);
    yield delay(1000);
    yield put({
      type: "LOG_OUT_SUCCESS",
    });
  } catch (err) {
    yield put({
      type: "LOG_OUT_FAILURE",
      data: err.response.data,
    });
  }
}

export default function* userSaga() {
  yield all([fork(watchLogin), fork(watchLogOut)]);
}
```

위처럼 saga를 배치한 뒤 reducer에 있는 데이터들도 변경되는 것에 따라 수정해준다.
특히 initialState에 로그인, 로그아웃 시도중이라는 status 키가 추가되었다. 로딩바를 위한 데이터이다.

`/reducers/user.js`

```jsx
export const initialState = {
  isLoggingIn: false, // 로그인 시도중
  isLoggedIn: false,
  isLoggingOut: false, // 로그아웃 시도중
  me: null,
  signUpData: {},
  loginData: {},
};

// 3가지 타입으로 만들었던 액션함수는 1개로 통일된다. success와 failure는 saga에서 처리
export const loginRequestAction = (data) => ({ type: "LOG_IN_REQUEST", data });
export const logoutRequestAction = () => ({ type: "LOG_OUT_REQUEST" });

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOG_IN_REQUEST":
      return {
        ...state,
        isLoggingIn: true,
      };
    case "LOG_IN_SUCCESS":
      return {
        ...state,
        isLoggingIn: false,
        isLoggedIn: true,
        me: { ...action.data, nickname: "vicky" },
      };
    case "LOG_IN_FAILURE":
      return {
        ...state,
        isLoggingIn: false,
        isLoggedIn: false,
      };
    case "LOG_OUT_REQUEST":
      return {
        ...state,
        isLoggingOut: true,
      };
    case "LOG_OUT_SUCCESS":
      return {
        ...state,
        isLoggingOut: false,
        isLoggedIn: false,
        me: null,
      };
    case "LOG_OUT_FAILURE":
      return {
        ...state,
        isLoggingOut: false,
      };
    default:
      return state;
  }
};

export default reducer;
```

각 컴포넌트별 적용데이터와 액션함수명을 변경사항에 따라 반영해준다.

`/components/LoginForm.js`

```jsx
import { useDispatch, useSelector } from "react-redux";
import { loginRequestAction } from "../reducers/user";

const LoginForm = () => {
  // isLoggingIn 추가
  const { isLoggingIn } = useSelector((state) => state.user);
  // 액션함수 변경
  const onSubmitForm = useCallback(() => dispatch(loginRequestAction({ id, password })), [id, password]);

  return (
    <FormWrapper onFinish={onSubmitForm}>
      {/* code.. */}
      <ButtonWrapper>
        <Button type="primary" htmlType="submit" loading={isLoggingIn}>
          로그인
        </Button>
        {/* code.. */}
      </ButtonWrapper>
    </FormWrapper>
  );
};

export default LoginForm;
```

`/components/UserProfile.js`

```jsx
import { useDispatch, useSelector } from "react-redux";
import { logoutRequestAction } from "../reducers/user";

const UserProfile = () => {
	// isLoggingOut 추가
  const { me, isLoggingOut } = useSelector((state) => state.user);
	// 액션함수 변경
  const onLogout = useCallback(() => dispatch(logoutRequestAction()), []);

  return (
      <Card.Meta title={me.nickname} avatar={<Avatar>{me.nickname[0]}</Avatar>} />
      <Button onClick={onLogout} loading={isLoggingOut}>
        로그아웃
      </Button>
    </Card>
  );
};

export default UserProfile;
```

이렇게 reducer와 saga의 user 액션들을 구현해보았다.

그런데 궁금증이 생긴다. Reducer와 saga는 어떤 순서로 실행되는 것일까?  
거의 동시에 두가지 모두가 이벤트 발생하지만 먼저 reducer의 user 함수가 실행되며,  
이후에 saga가 동작하는 것을 콘솔 디버깅을 통해 알 수 있다.

아직 서버가 만들어지지 않았지만 delay함수를 통해 더미데이터를 생성하여 프론트화면을 구성할 수 있다.  
다음 시간부터는 차곡차곡 기능을 모두 만들어보자!

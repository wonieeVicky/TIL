# saga 이펙트 알아보기

우선 saga 동작을 위해 axios를 설치해준다.

```bash
$ npm i axios
```

이제 saga를 구동하기 위한 이펙트들을 자세히 알아보자. 우선 사가의 이펙트들로 all, fork, call, put, take 등이 있다. 해당 이펙트는 saga 이벤트 안에서 기입하는데 saga 액션에 대한 코드는 sagas라는 별도 폴더를 추가하여 넣어보자.

`/front/sagas/index.js`

```jsx
import { all, fork, call, put, take } from "redux-saga/effects"; // 1
import axios from "axios";

// 7. 실제 api 처리
function logInAPI(data) {
  return axios.post("/api/login", dta);
}

function* logIn(action) {
  // 5. try ~ catch로 성공 실패 분리
  try {
    const result = yield call(logInAPI, action.data);
    // 6. Put 이펙트
    yield put({
      type: "LOG_IN_SUCCESS",
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: "LOG_IN_FAILURE",
      data: err.response.data,
    });
  }
}

// 3. 비동기 action Creator
function* watchLogin() {
  yield take("LOG_IN_REQUEST", logIn); // 4. take 이펙트, logIn 제너레이터 실행
}

function* watchLogOut() {
  yield take("LOG_OUT");
}

function* watchAddPost() {
  yield take("APP_POST");
}

// 2. 우리가 만들고 싶은 비동기 액션을 만들어준다.
export default function* rootSaga() {
  {
    /* 2. all & fork */
  }
  yield all([fork(watchLogin), fork(watchLogOut), fork(watchAddPost)]);
}
```

1.  rootSage에서 필요한 비동기 액션을 넣어주면 된다.
2.  all은 배열을 인자로 받고, 배열 안에 있는 것들을 한번에 모두 실행해준다.
    여기서 all 배열 인자 안에 있는 fork 이펙트는 **이 함수를 실행한다는 의미**의 이펙트이다.
    fork 대신 call 이펙트를 사용할 수도 있는데, 이 두가지 이펙트의 차이점이 있다.

        fork는 비동기 함수 호출, call은 동기 함수 호출이다.
        때문에 call을 사용하면 실행함수가 리턴될 때까지 기다려서 Result를 기반으로 동작한다.
        반면에 fork를 사용하면 실행함수가 리턴되는 것을 기다리지 않고 바로 다음 함수(액션)을 실행한다.

        즉 fork는 논블로킹, call은 블로킹을 하는 이펙트이다. yield는 await을 해주는 역할을 담당한다.
        아래의 예시를 보면 이해하기 쉽다.

        - 여기를 눌러 예시를 확인해보자!
        - call과 fork의 실행방법

3.  saga의 비동기 Action Creator는 이벤트 리스너의 역할과 비슷하다.
    (thunk에서는 직접 액션 creator를 실행한다.)
4.  take 이펙트는 **기다리겠다라는 의미** : LOG_IN이란 action이 실행될 때까지 기다리겠다.
5.  api Response에 대한 성공, 에러 처리는 try ~ catch로 처리한다.

    성공은 result.data에, 실패는 err.response.data에 있다(고 가정한다.)

6.  put 이펙트는 액션 객체를 **dispatch의 역할을 담당**한다.
7.  실제 API는 일반 함수로 구현한다.

위와 같이 다른 비동기 액션들도 비슷한 패턴으로 만들어나가면 된다. yield 함수를 몰라도 saga 사용의 패턴이 있으므로 비슷하게 구현할 수 있으나 saga에는 delay, debounce, throttle, takeLatest, takeEvery, takeMaybe, takeLeading와 같은 다양한 이펙트들이 존재하므로 구조에 대한 이해를 확실히 하고 넘어가면 더 많은 액션을 커스텀할 수 있다. 또한 saga의 장점은 단위별 테스트가 편하다는 점이 있다. yield를 많이 사용한 함수일수록 next 메서드를 통해 순차적인 데이터 진행을 만들 수 있으므로 면밀한 기능 리뷰가 가능한 것이다.

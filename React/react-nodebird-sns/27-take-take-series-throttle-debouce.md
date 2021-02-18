# take, take 시리즈, throttle 알아보기

## take

take 이펙트의 특징이 있다. 한번 실행되면 사라진다는 것이다

```jsx
function* watchLogin() {
  yield take("LOG_IN_REQUEST", logIn);
}
function* watchLogOut() {
  yield take("LOG_OUT_REQUEST", logOut);
}
```

만약 위와 같은 액션Creator가 있다고 할 때 한번 로그인 - 로그아웃 후에는 재 로그인 - 로그아웃이 불가능한 것이다. 그렇다면 어떻게 해결할 수 있을까? 바로 앞 전에 배운 제너레이터의 무한 반복 패턴을 사용하는 것이다!

## while ~ take

```jsx
function* watchLogin() {
  while (true) {
    yield take("LOG_IN_REQUEST", logIn); // LOG_IN이란 action이 실행될 때까지 기다리겠다. logIn 제너레이터 실행
  }
}
function* watchLogOut() {
  while (true) {
    yield take("LOG_OUT_REQUEST", logOut);
  }
}
```

위와 같이 while문으로 감싸주면 언제든지 다시 실행시킬 수 있는 action Creator가 만들어진다. 하지만 코드가 조금 더 복잡해지므로 saga에서는 이런 경우에 사용할 수 있는 takeEvery 이펙트를 제공한다.

## takeEvery

```jsx
function* watchLogin() {
  yield takeEvery("LOG_IN_REQUEST", logIn);
}
function* watchLogOut() {
  yield takeEvery("LOG_OUT_REQUEST", logOut);
}
```

단 while를 감싼 방법과 다른 점은 **while ~ take는 동기적으로 동작하지만 takeEvery는 비동기로 동작**한다는 차이점이 있다. takeLatest는 조금 다른 이펙트이다. 아래 예시를 보자

## takeLatest

```jsx
function* watchLogin() {
  yield takeLatest("LOG_IN_REQUEST", logIn);
}
function* watchLogOut() {
  yield takeLatest("LOG_OUT_REQUEST", logOut);
}
function* watchAddPost() {
  yield takeLatest("APP_POST_REQUEST", addPost);
}
```

**takeLatest는 여러번 클릭해도 마지막 동작에서만 액션을 처리**하도록 해주는 이펙트이다. (**takeLeading은 첫번째 것만 액션을 실행**해준다.) 단 takeLatest를 적용한다고 해서 무조건 앞의 요청을 취소한다기보다는 함수가 동시다발적으로 입력되어 모두 종료되지 않은 상태일 때는 마지막 액션만을 실행시키고, 함수가 모두 실행되었을 경우에는 다시 실행시켜주는 개념이다. (버튼 클릭 후 10초 뒤 다시 누른다고 했을 때, 이미 액션이 종료된 상태이므로 다시 액션을 발생시킨다.)

**takeLatest의 또 다른 단점은** 이러한 액션처리 방식이 모두 프론트에서만 하나의 액션으로 인식된다는 것이다. 좀 더 명확한 표현으로는 **응답을 취소하는 것이지 요청을 취소하는 것은 아니라는 것**이다. 즉 두 번 중복 이벤트가 발생했을 때 백엔드에 2번 요청은 그대로 전해지며, 이후에 오는 응답 값은 2개이더라도 프론트 서버에서 하나의 액션만 처리하도록 해준다. 결론적으로 데이터를 관리하는 서버 쪽에서 반드시 똑같은 데이터가 연달아 저장된 것이 아닌지 검사를 별도로 해줘야 한다. 만약 검사를 안하면 실제 같은 정보가 두번 저장될 것이다 🤮

## throttle

위와 같은 단점으로 인해 우리는 throttle이라는 이펙트를 사용할 수도 있다.

```jsx
function* watchLogin() {
  yield throttle("LOG_IN_REQUEST", logIn, 2000);
}
function* watchLogOut() {
  yield throttle("LOG_OUT_REQUEST", logOut, 3000);
}
function* watchAddPost() {
  yield throttle("APP_POST_REQUEST", addPost, 1000);
}
```

throttle은 뒤에 지정한 시간 내에 단 한번만 액션이 실행되도록 설정해놓는 이펙트이다. 이렇게 설정해놓으면 정해진 시간 내에는 요청 자체도 중복되지 않고 단 한번만 실행되며, 응답 역시 하나의 response만 오게 될 것이다.

보통은 throttle보다는 takeLatest를 사용하여 구현하고, 특별히 디도스 공격처럼 무한 액션 이벤트가 발생할 요지가 있는 것들의 경우 throttle 이펙트를 사용하여 구현한다.

다음으로, 현재는 서버를 만들기 전이므로 API 발생 시 모두 에러가 발생할 것이다. 이럴 때에는 delay 이펙트를 사용해 api 함수를 대신하도록 한다.

## throttle과 debouce의 차이점

해당 내용은 제로초 블로그의 [[쓰로틀링과 디바운싱](https://www.zerocho.com/category/JavaScript/post/59a8e9cb15ac0000182794fa)]이라는 글에서 더 자세히 볼 수 있다.

- 쓰로틀링: 마지막 함수가 호출된 후 일정 시간이 지나기 전에 다시 호출되지 않도록 하는 것
- 디바운싱: 연이어 호출되는 함수들 중 마지막 함수(또는 제일 처음)만 호출하도록 하는 것

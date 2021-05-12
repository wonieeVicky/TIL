# MobX 구조 잡기

먼저 mobX 라이브러리를 프로젝트에 설치해준다.

```bash
$ npm i mobx
$ npm i mobx-react
```

몹엑스는 데이터 구조가 리덕스에 비해 자유로운 편이다. 이에 따라 몹엑스는 다양한 구조로 프로젝트를 이끌어나갈 수 있는데 이 때문에 구조가 뒤죽박죽 될 수 있으니 적절한 규칙으로 운영하는 것이 좋다.

가장 먼저 `client.tsx`에서 Root 컴포넌트인 App을 몹엑스 스토어로 감싸주는 것부터 시작해보자.

`/client.tsx`

```tsx
import * as React from "react"; // index.d.ts에서 export default를 지원하지 않으므로 * as를 사용한다.
import * as ReactDOM from "react-dom";

import { StoreProvider } from "./Context";
import App from "./App";

ReactDOM.render(
  <StoreProvider>
    <App />
  </StoreProvider>,
  document.querySelector("#root")
);
```

위 StoreProvider는 `Context.tsx`에서 정의한 `storeContext`를 가져온 것이다.  
`Context.tsx`에서는 mobX context를 생성하고, 이를 Provider로 상속해주는 역할을 담당한다.

```tsx
import * as React from "react";
import { createContext, ReactElement, FC } from "react";
import { userStore, postStore } from "./store";

// 몹엑스 Context 생성!
export const storeContext = createContext({
  userStore,
  postStore,
});

export const StoreProvider = ({ children }) => (
  <storeContext.Provider value={{ userStore, postStore }}>{children}</storeContext.Provider>
);
```

그러면 위 createContext에 들어가는 userStore, postStore에 대한 mobX initialState를 생성해보자.

`store.ts`

```tsx
import { observable, action } from "mobx";

// mobx에서 화살표 함수를 사용하면 this를 사용하지 못함
// store 데이터는 observable로 감싸준다.
const userStore = observable({
  isLoggingIn: false,
  data: null,
  logIn: action((data) => {
    userStore.isLoggingIn = true;
    setTimeout(
      action(() => {
        userStore.data = data;
        userStore.isLoggingIn = false;
        postStore.addPost("hello");
      }),
      2000
    );
  }),
  logOut: action(() => {
    userStore.data = null;
  }),
});

const postStore = observable({
  data: [],
  addPost: action((data) => postStore.data.push(data)),
});

export { userStore, postStore };
```

mobX의 초기 컨텍스트를 생성하기 위해서는 mobx에서 제공하는 observable과 action을 사용한다.  
몹엑스는 Redux와 다르게 observable로 액션 함수도 넣어줄 수 있는데, 이때 액션함수는 action 메서드에 감싸주는 것이 바람직하다. (간헐적으로 state가 업데이트 되지 않는 이슈가 있음)

초기 컨텍스트는 유형에 따라 userStore, postStore등으로 분리해서 작성할 수 있고, 각 스토어 내에서 상대 store 데이터의 변경도 가능하며, 데이터 불변성을 자체적으로 지켜주기 때문에 값 변경 시 불변성을 고려할 필요가 없다.

이제 App 컴포넌트에서 mobX 의 컨텍스트를 가져와서 사용해준다.

`App.tsx`

```tsx
import * as React from "react";
import { useCallback } from "react";
import { observer, useLocalStore } from "mobx-react";
import { action } from "mobx";
import { postStore, userStore } from "./store";

// 1. mobx의 컨텍스트 안에서 변경을 감지하려면 observer를 컴포넌트에 감싸주어야 한다.
const App = observer(() => {
  // 2. useLocalStore는 react의 useState와 비슷한 역할을 한다.
  const state = useLocalStore(() => ({
    name: "",
    password: "",
    onChangeName: action(function (e) {
      this.name = e.target.value;
    }),
    onChangePassword: action(function (e) {
      this.password = e.target.value;
    }),
  }));

  const onLogin = useCallback(
    () =>
      // 3. mobX context 사용
      userStore.logIn({
        nickname: "빅희언니",
        password: "1234",
      }),
    [state.name, state.password]
  );

  const onLogOut = useCallback(() => userStore.logOut(), []);

  return (
    <div>
      {userStore.isLoggingIn ? (
        <div>로그인 중</div>
      ) : userStore.data ? (
        <div>{userStore.data.nickname}</div>
      ) : (
        "로그인 해주세요."
      )}
      {!userStore.data ? <button onClick={onLogin}>로그인</button> : <button onClick={onLogOut}>로그아웃</button>}
      <div>
        <input value={state.name} onChange={state.onChangeName} />
        <input value={state.password} onChange={state.onChangePassword} />
      </div>
    </div>
  );
});

export default App;
```

1. mobX 컨텍스트 안에서 데이터를 사용하려면 observer로 해당 컴포넌트를 감싸줘야한다.
2. useLocalStore는 react의 useState와 비슷한 역할을 한다. 해당 컴포넌트 내에서만 사용할 로컬 state를 담는 용도로 사용한다.
3. 기타 mobX 콘텍스트의 data들은 userStore, postStore을 직접 import해와서 사용한다.

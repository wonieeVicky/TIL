# MobX typing

`App.tsx`의 useLocalStore와 `Context.tsx`의 StoreProvider, `store.ts` 내부의 userStore, postStore에 대한 타이핑을 해보자

`Context.tsx`

```tsx
import * as React from "react";
import { createContext, ReactElement, FC } from "react";
import { userStore, postStore } from "./store";

export const storeContext = createContext({
  userStore,
  postStore,
});

// ProviderProps Typing
interface ProviderProps {
  children: ReactElement;
}

export const StoreProvider: FC<ProviderProps> = ({ children }) => (
  <storeContext.Provider value={{ userStore, postStore }}>{children}</storeContext.Provider>
);
```

`store.ts`

```tsx
import { observable, action } from "mobx";

// 자주 사용되는 타입은 분리해둔다.
export interface User {
  nickname: string;
  password: string;
}

// userStore Typing
interface IUserStore {
  isLoggingIn: boolean;
  data: User | null;
  logIn: (data: User) => void;
  logOut: () => void;
}

const userStore = observable<IUserStore>({
  isLoggingIn: false,
  data: null,
  logIn: action((data: User) => {
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

// postStore Typing
interface IPostStore {
  data: string[];
  addPost: (data: string) => void;
}

const postStore = observable<IPostStore>({
  data: [],
  addPost: action((data: string) => postStore.data.push(data)),
});

export { userStore, postStore };
```

`App.tsx`

```tsx
import * as React from "react";
import { useCallback } from "react";
import { observer, useLocalStore } from "mobx-react";
import { action } from "mobx";
import { postStore, userStore } from "./store";

// LocalStore Typing
interface LocalStore {
  name: string;
  password: string;
  onChangeName: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangePassword: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const App = observer(() => {
  const state = useLocalStore<LocalStore>(() => ({
    name: "",
    password: "",
    onChangeName: action(function (this: LocalStore, e: React.ChangeEvent<HTMLInputElement>) {
      this.name = e.target.value;
    }),
    onChangePassword: action(function (this: LocalStore, e: React.ChangeEvent<HTMLInputElement>) {
      this.password = e.target.value;
    }),
  }));

	//...

  return (
    // code..
  );
});

export default App;
```

이와 같이 정의해주면 모든 타이핑이 완료된다. 단, 로컬 환경을 실행시켜보면 `mobx-react`의 타입에서 에러가 발생하는데 이는 mobx-react 내 타입정의가 \* as React가 아닌 default React로 사용하고 있기 때문, 즉 이런 경우 `tsconfig.json`의 `esModuleInterop` 옵션을 활성화해주면 된다.

(그러나 이는 올바른 방법은 아니다. 엄연히 default와 namespace 로 함수를 가져오는 것은 다른 방법이지만, 의존성이 있는 라이브러리를 사용하여 해당 부분이 계속 에러가 발생한다면 이런 부분은 옵션을 활성화하여 처리해주는 방법 밖에 없다.)

`tsconfig.json`

```json
{
  "compilerOptions": {
    "strict": true,
    "lib": ["ES5", "ES2015", "ES2016", "ES2017", "DOM"],
    "jsx": "react",
    "esModuleInterop": true // * as 를 빼도된다.
  },
  "exclude": ["node_modules"]
}
```

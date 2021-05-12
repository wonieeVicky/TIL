import * as React from "react";
import { useCallback } from "react";
import { observer, useLocalStore } from "mobx-react";
import { action } from "mobx";
import { postStore, userStore } from "./store";

interface LocalStore {
  name: string;
  password: string;
  onChangeName: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangePassword: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const App = observer(() => {
  // useLocalStore는 react의 useState와 비슷한 역할을 한다.
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

  const onLogin = useCallback(
    () =>
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

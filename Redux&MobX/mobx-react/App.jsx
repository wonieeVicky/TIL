import React, { useCallback } from "react";
import { useLocalObservable, observer } from "mobx-react";
import { userStore, postStore } from "./store";
import { action, runInAction } from "mobx";

const App = () => {
  const state = useLocalObservable(() => ({
    name: "",
    password: "",
    onChangeName: (e) => runInAction(() => (state.name = e.target.value)),
    onChangePassword: action((e) => (state.password = e.target.value)),
  }));

  const onLogIn = useCallback(
    () =>
      userStore.logIn({
        nickname: "vicky",
        password: 123,
      }),
    []
  );

  const onLogOut = useCallback(() => userStore.logOut(), []);

  return (
    <div>
      {userStore.isLoggingIn ? (
        <div>로그인 중입니다.</div>
      ) : userStore.data ? (
        <div>{userStore.data.nickname}</div>
      ) : (
        "로그인 해주세요"
      )}
      {!userStore.data ? <button onClick={onLogIn}>로그인</button> : <button onClick={onLogOut}>로그아웃</button>}
      <div>{postStore.postLength}</div>
      <div>
        <input value={state.name} onChange={state.onChangeName} />
        <input value={state.password} type="password" onChange={state.onChangePassword} />
      </div>
    </div>
  );
};

export default observer(App);

import React, { Component } from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { userStore, postStore } from "./store";

// observer는 컴포넌트 안에서 쓰이는 observable이 바뀌면 자동으로 컴포넌트를 리렌더링해준다.
@observer // decorator는 hoc이다. 주로 클래스는 decorator로 초기에 선언하여 HOC를 대신할 수 있다.
class App extends Component {
  // 컴포넌트 안에서만 쓰는 state
  state = observable({
    name: "",
    password: "",
  });
  onLogIn = () =>
    userStore.logIn({
      nickname: "vicky",
      password: "123",
    });

  onLogOut = () => userStore.logOut();

  onChangeName = e => (this.state.name = e.target.value);
  onChangePassword = e => (this.state.password = e.target.value);

  render() {
    return (
      <div>
        {userStore.isLoggingIn ? (
          <div>로그인 중입니다.</div>
        ) : userStore.data ? (
          <div>{userStore.data.nickname}</div>
        ) : (
          "로그인 해주세요"
        )}
        {!userStore.data ? (
          <button onClick={this.onLogIn}>로그인</button>
        ) : (
          <button onClick={this.onLogOut}>로그아웃</button>
        )}
        <div>{postStore.data.length}</div>
        <div>
          <input value={this.state.name} onChange={this.onChangeName} />
          <input
            value={this.state.password}
            type="password"
            onChange={this.onChangePassword}
          />
        </div>
      </div>
    );
  }
}

export default App;

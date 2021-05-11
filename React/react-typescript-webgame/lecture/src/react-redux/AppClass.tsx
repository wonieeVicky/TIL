﻿import * as React from "react";
import { Component } from "react";
import { connect } from "react-redux";
import { logIn, logOut, ThunkDispatch } from "./actions/user";
import { RootState } from "./reducers";
import { UserState } from "./reducers/user";

// Props Typing - 분리하여 관리
interface StateToProps {
  user: UserState;
}

interface DispatchToProps {
  dispatchLogIn: ({ id, password }: { id: string; password: string }) => void;
  dispatchLogOut: () => void;
}

// Props를 &로 merge
class App extends Component<StateToProps & DispatchToProps> {
  onClick = () => {
    this.props.dispatchLogIn({
      id: "vicky",
      password: "비밀번호",
    });
  };

  onLogout = () => {
    this.props.dispatchLogOut();
  };

  render() {
    const { user } = this.props;
    return (
      <div>
        {user.isLoggingIn ? <div>로그인 중</div> : user.data ? <div>{user.data.nickname}</div> : "로그인 해주세요."}
        {!user.data ? (
          <button onClick={this.onClick}>로그인</button>
        ) : (
          <button onClick={this.onLogout}>로그아웃</button>
        )}
      </div>
    );
  }
}

// state는 reducer의 combineReducers 이다. -> RootState로 가져온다.
const mapStateToProps = (state: RootState) => ({
  user: state.user,
  posts: state.posts,
}); // reselect

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  dispatchLogIn: (data: { id: string; password: string }) => dispatch(logIn(data)),
  dispatchLogOut: () => dispatch(logOut()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);

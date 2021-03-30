import React, { Component } from 'react';
import { connect } from 'react-redux';
const { logIn, logOut } = require('./actions/user');

class ClassApp extends Component {
  onClick = () => this.props.dispatchLogIn({ id: 'vicky', password: '0326!!' });
  onLogout = () => this.props.dispatchLogOut();

  render() {
    const { user } = this.props;
    return (
      <div>
        {user.isLoggingIn ? (
          <div>로그인 중입니다.</div>
        ) : user.data ? (
          <div>{user.data.nickname}</div>
        ) : (
          '로그인 해주세요'
        )}
        {!user.data ? (
          <button onClick={this.onClick}>로그인</button>
        ) : (
          <button onClick={this.onLogout}>로그아웃</button>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  posts: state.posts,
}); // reselect, user가 바뀌었을 때 posts도 같이 업데이트 된다.

const mapDispatchToProps = (dispatch) => ({
  dispatchLogIn: (data) => dispatch(logIn(data)),
  dispatchLogOut: () => dispatch(logOut()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ClassApp);

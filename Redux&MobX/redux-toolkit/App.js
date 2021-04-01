import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";

const { logIn } = require("./actions/user");
const userSlice = require("./reducers/user");

// 순수함수는 바깥으로 분리해도 된다.
const userSelector = (state) => state.user;
const priceSelector = (state) => state.user.prices;
// createSelector를 재사용하고 싶을 때에는 함수로 한번 감싸서 selector를 새로 만들어서 넣어주는 방식으로 사용해야 한다.
const makeSumPriceSelector = () => createSelector(priceSelector, (prices) => prices.reduce((a, c) => a + c, 0));
const sumPriceSelector = makeSumPriceSelector();

const App = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isLoggingIn, data } = useSelector(userSelector);
  const totalPrices = useSelector(sumPriceSelector);

  const dispatch = useDispatch();

  const onChangeEmail = useCallback((e) => setEmail(e.target.value), []);
  const onChangePassword = useCallback((e) => setPassword(e.target.value), []);

  const onClick = useCallback(() => dispatch(logIn({ id: "vicky", password: "0326!!" })), []);
  const onLogout = useCallback(() => dispatch(userSlice.actions.logOut()), []);
  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      dispatch(
        userSlice.actions.setLoginForm({
          email,
          password,
        })
      );
    },
    [dispatch, email, password]
  );

  return (
    <div>
      {isLoggingIn ? <div>로그인 중입니다.</div> : data ? <div>{data.nickname}</div> : "로그인 해주세요"}
      {!data ? <button onClick={onClick}>로그인</button> : <button onClick={onLogout}>로그아웃</button>}
      <div>
        <b>{totalPrices}원</b>
      </div>
      <form onSubmit={onSubmit}>
        <input type="email" value={email} onChange={onChangeEmail} />
        <input type="password" value={password} onChange={onChangePassword} />
      </form>
    </div>
  );
};

export default App;

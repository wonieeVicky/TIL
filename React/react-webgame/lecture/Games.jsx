import React from "react";
import { BrowserRouter, Link, Route } from "react-router-dom";
import GameMatcher from "./GameMatcher";

const Games = () => {
  return (
    <BrowserRouter>
      <Link to="/game/number-baseball?query=100&hello=vicky&bye=react">숫자야구</Link>&nbsp;
      <Link to="/game/rock-scissors-paper">가위바위보</Link>&nbsp;
      <Link to="/game/lotto-generator">로또추첨기</Link>&nbsp;
      <Link to="/game/index">게임 매쳐</Link>
      <div>
        <Route exact path="/" render={(props) => <GameMatcher {...props} />} />
        <Route path="/game/:name" render={(props) => <GameMatcher {...props} />} />
      </div>
    </BrowserRouter>
  );
};

export default Games;

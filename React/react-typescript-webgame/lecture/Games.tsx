import * as React from "react";
import { Switch, BrowserRouter, Link, Route } from "react-router-dom";
import GameMatcher from "./GameMatcherClass";

const Games = () => {
  return (
    <BrowserRouter>
      <div>
        <Link to="/game/number-baseball?limit=10&page=5">숫자야구</Link>
        &nbsp;
        <Link to="/game/rock-scissors-paper">가위바위보</Link>
        &nbsp;
        <Link to="/game/lotto-generator">로또생성기</Link>
        &nbsp;
        <Link to="/game/index">게임 매쳐</Link>
      </div>
      <div>
        <Switch>
          {/* Props로 Route의 속성들을 내려줄 필요가 없다. */}
          <Route exact path="/" component={GameMatcher} />
          <Route path="/game/:name" component={GameMatcher} />
        </Switch>
      </div>
    </BrowserRouter>
  );
};

export default Games;

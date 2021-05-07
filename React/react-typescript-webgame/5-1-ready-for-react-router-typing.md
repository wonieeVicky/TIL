# React-router typing 사전 준비

`nextjs` 등 별도 라우팅 제공하는 프레임워크를 사용하지 않을 경우 보통 React-router를 통해 페이지 라우팅 처리를 해준다. 이번에는 기존에 만들었던 게임을 각 페이지 별로 라우팅하는 과정에 있어서 React-router 타이핑을 해보도록 한다!

먼저 lecture에 react-router를 설치해준다.  
react-router는 타입 지원을 별도로 하지 않으므로 @types 파일도 깔아주도록 한다.

`/lecture`

```bash
$ npm i react-router
$ npm i react-router-dom
$ npm i @types/react-router
$ npm i @types/react-router-dom
```

리액트 라우터에서 가장 중요하고 자주 쓰는 메서드는 history, location, match이다.  
이 3개에 대한 타이핑을 주로 진행 (이외로 WithRouter) 위 패키지 설치 후 라우터 역할을 할 컴포넌트를 생성한다.

`/lecture/Games.tsx`

```tsx
import * as React from "react";
import { Switch, BrowserRouter, Link, Route } from "react-router-dom";
import GameMatcher from "./GameMatcher";

const Games = () => {
  return (
    <BrowserRouter>
      <div>
        <Link to="/game/number-baseball">숫자야구</Link>
        &nbsp;
        <Link to="/game/rock-scissors-paper">가위바위보</Link>
        &nbsp;
        <Link to="/game/lotto-generator">로또생성기</Link>
        &nbsp;
        <Link to="/game/index">게임 매쳐</Link>
      </div>
      <div>
        <Switch>
          <Route exact path="/" render={(props) => <GameMatcher {...props} />} />
          {/* this.props.match.params.name으로 각 path가 걸러진다. */}
          <Route path="/game/:name" render={(props) => <GameMatcher {...props} />} />
        </Switch>
      </div>
    </BrowserRouter>
  );
};

export default Games;
```

`/lecture/GameMatcher.tsx`

상위 `path="/game/:name"` 으로 들어온 라우터 파라미터가 `this.props.match.params.name`로 들어와서 적절한 컴포넌트로 아래와 같이 분기처리를 해준다.

```tsx
import * as React from "react";
import { Component } from "react";
import NumberBaseball from "./src/NumberBaseballClass";
import RSP from "./src/RSPClass";
import Lotto from "./src/LottoClass";

class GameMatcher extends Component {
  render() {
    // let urlSearchParams = new URLSearchParams(this.props.location.search.slice(1));
    // console.log(urlSearchParams.get("hello"));
    if (this.props.match.params.name === "number-baseball") {
      return <NumberBaseball />;
    } else if (this.props.match.params.name === "rock-scissors-paper") {
      return <RSP />;
    } else if (this.props.match.params.name === "lotto-generator") {
      return <Lotto />;
    }
    return <div>일치하는 게임이 없습니다.</div>;
  }
}
export default GameMatcher;
```

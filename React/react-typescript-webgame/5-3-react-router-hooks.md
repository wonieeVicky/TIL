# react-router hooks Typing

Hooks를 사용한 react-router 타이핑을 진행해보자. 기존 클래스형 컴포넌트에서의 타이핑보다 훨씬 간단하므로 앞으로 개발에 있어서 함수형 컴포넌트로 적용하는 것이 바람직하다.

`Games.tsx`

```tsx
import * as React from "react";
import { Switch, BrowserRouter, Link, Route } from "react-router-dom";
import GameMatcher from "./GameMatcherClass";

const Games = () => {
  return (
    <BrowserRouter>
      <div>{/* menus... */}</div>
      <div>
        <Switch>
          {/* Props로 Route의 속성들을 내려줄 필요가 없다. */}
          <Route exact path="/" render={() => <GameMatcher />} />
          <Route path="/game/:name" render={() => <GameMatcher />} />
        </Switch>
      </div>
    </BrowserRouter>
  );
};

export default Games;
```

우선 Games 컴포넌트에서도 GameMatcher 컴포넌트에 더이상 props로 `Routes`의 속성을 내려줄 필요가 없어진다. 상세한 내용은 GameMatcher 컴포넌트를 보자

`GameMatcher.tsx`

```tsx
import * as React from "react";
import NumberBaseball from "./src/NumberBaseballClass";
import RSP from "./src/RSPClass";
import Lotto from "./src/LottoClass";
import { useHistory, useRouteMatch, useLocation } from "react-router";

const GameMatcher = () => {
  // 1. match, location, history Typing
  const match = useRouteMatch<{ name: string }>();
  const location = useLocation();
  const history = useHistory();

  let urlSearchParams = new URLSearchParams(location.search.slice(1));
  console.log(urlSearchParams.get("limit"));

  if (match.params.name === "number-baseball") {
    return <NumberBaseball />;
  } else if (match.params.name === "rock-scissors-paper") {
    return <RSP />;
  } else if (match.params.name === "lotto-generator") {
    return <Lotto />;
  } else {
    return <div>일치하는 게임이 없습니다.</div>;
  }
};
export default GameMatcher;
```

기존 `RouteComponentProps`로 타이핑을 해주던 번거로운 방법 없이 해당 컴포넌트 자체에서 `useRouteMatch`, `useLocation`, `useHistory`를 사용해 react-router의 메서드에 접근할 수 있다.

단, 1에서 처럼 match.params에 name이라는 사용자 props가 추가되었으므로 해당 프로퍼티에 대한 타이핑을 제네릭으로 추가해주면 문제없이 동작한다. (기존의 extends 등으로 타입을 커스텀해줬던 방법보다 훨씬 간단함)

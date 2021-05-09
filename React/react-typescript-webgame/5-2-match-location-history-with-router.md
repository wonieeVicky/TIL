# match, location, history & withRouter Typing

### match, location, history 타이핑

react-router를 사용할 때에는 주로 match, location, history 메서드를 많이 사용하는 편이다.
기존 react-router(react-router-dom)의 메서드들, 즉 match, location, history 에 대한 타이핑은 이미 작성되어 있지만, 만약 사용자 정의에 따른 props가 추가될 경우 기존 타이핑에 추가해줘야하는 이슈도 발생한다.

`Game.tsx`

```tsx
<Route path="/game/:name" render={(props) => <GameMatcher {...props} />} />
```

가령 Game.tsx 컴포넌트에서 GameMatcher 상속 시 아래와 같이 path 매개변수에 name 프로퍼티를 사용자 정의 메서드로 추가해줬는데 이러한 이슈가 바로 기존 RouteComponentProps에 커스텀을 추가하는 방법이 필요한 예이다.

`GameMatcher.tsx`

```tsx
import * as React from "react";
import { Component } from "react";
import NumberBaseball from "./src/NumberBaseballClass";
import RSP from "./src/RSPClass";
import Lotto from "./src/LottoClass";
import { RouteChildrenProps } from "react-router";

// Props 커스텀 사용방법 1: extends 메서드를 사용해 타이핑(name) 추가
/* interface Props extends RouteComponentProps {
  hello: "vicky"; // 나만의 props 추가
}*/

// 1. 컴포넌트가 상속받는 Props가 있을 경우 타이핑을 지정해줘야 this.props 사용 시 에러가 발생하지 않는다.
// Props 커스텀 사용방법 2: 제네릭을 사용해 타이핑(name) 추가
class GameMatcher extends Component<RouteChildrenProps<{ name?: string }>> {
  render() {
    // 2. Props에 대한 타이핑 후에도 에러가 발생할 경우
    if (!this.props.match) {
      return <div>일치하는 게임이 없습니다.</div>;
    }

    // 3. query-string 가져오기
    let urlSearchParams = new URLSearchParams(this.props.location.search.slice(1));
    console.log(urlSearchParams.get("limit"));

    if (this.props.match.params.name === "number-baseball") {
      return <NumberBaseball />;
    } else if (this.props.match.params.name === "rock-scissors-paper") {
      return <RSP />;
    } else if (this.props.match.params.name === "lotto-generator") {
      return <Lotto />;
    }
  }
}
export default GameMatcher;
```

1. class 컴포넌트에서 상속받는 Props가 있을 경우 별도의 타이핑이 필요하다.

   우선 기존에 제공되는 React-router의 타이핑에 `RouteChildrenProps`(혹은 `RouteComponentProps`) 이 있는데, 여기에 사용자가 직접 넣어준 커스텀 props인 name을 추가해줘야 한다. 방법은 별도의 `interface`로 `RouteComponentProps`를 `extends` 하여 추가해주는 방법 1과 직접 제네릭으로 추가되는 타입을 넣어주는 (`<RouteChildrenProps<{ name?: string }>>`) 방법 2가 있다.

   또한 name 프로퍼티를 직접 타입을 지정해주는 방식으로 엄격하게 사용할 수도 있다. (가령 아래와 같이..)
   `type GamesType = "number-baseball" | "rock-scissors-paper" | "lotto-generator" | "";` 하지만 라우팅될 게임이 추가될 가능성이 있으므로 이번에는 string으로만 넣어준다.

2. Props에 대한 타이핑 후에도 this.props.match에 타입에러가 발생하는데, 이 경우에는 this.props.match가 존재하지 않는 경우에 대한 타입에러를 발생시키고 있는 것으로, 상단에 해당 프로퍼티가 없을 경우에 대한 분기를 추가해주면 된다.
3. 간혹 주소에 `window.location.search`로 들어오는 데이터를 타이핑 해야하는 경우도 발생한다. 이 데이터는 URLSearchParams라는 메서드로 query-string 데이터를 가져올 수 있다.

이 밖에도 헷갈리는 지점이 발생할 경우 Go to definition을 이용해 각 타이핑에 대한 구조를 확인하도록 하자!

### withRouter 타이핑

`Route`보다 바깥에 있는 컴포넌트의 경우 `Route`에 대한 `Props`를 상속받지 못하기 때문에, 이러한 경우 `withRouter`로 감싸서 match, history, location을 `props`로 내려줄 수 있다.

아래 예시 컴포넌트가 있다고 하자.

```tsx
import { RouteComponentProps } from "react-router";
import { withRouter } from "react-router-dom";

class Test from Component<RouteComponentProps<{ name?: string }>>{
	render(){
		return (
			// codes..
		)
	}
}

export default withRouter(Test);
```

Test 컴포넌트에 withRouter를 감싸줄 경우 Test에 대한 타입에러가 발생하는데 이럴 경우에는 어떤 문제인지 go to definition으로 확인해주면 아래와 같다.

```tsx
export function withRouter<P extends RouteComponentProps<any>, C extends React.ComponentType<P>>(
  component: C & React.ComponentType<P>
): React.ComponentClass<Omit<P, keyof RouteComponentProps<any>> & WithRouterProps<C>> & WithRouterStatics<C>;
```

`withRouter`를 사용할 때에는 반드시 `RouteComponentProps`가 존재해야하며, `withRouter`로 감싸는 component의 경우 `React.ComponentType`이어야 함 즉, 클래스형 혹은 함수형 컴포넌트여야 한다는 것을 설명해주고 있다.

따라서 위 Test 컴포넌트에 `RouteComponentProps` 라는 props 타이핑을 추가하여 타입 에러가 발생하지 않도록 처리해준다.!

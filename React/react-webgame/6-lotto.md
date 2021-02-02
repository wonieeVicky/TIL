# 로또 추첨기 만들기

## 6-1. 로또 추첨기 컴포넌트

setTimeout으로 무작위로 생성한 7개의 숫자를 순서대로 노출하는 컴포넌트를 만들어본다.

1. 먼저 7개의 순서를 무작위로 생성하는 별도의 함수가 필요하다.

```jsx
function getWinNumbers() {
  // 0 - 45까지 들어있는 배열 생성
  const candidate = Array(45)
    .fill()
    .map((v, i) => i + 1);
  // 랜덤 숫자를 넣는 빈 배열 생성
  const shuffle = [];
  // candidate가 빈배열이 될 때까지 아래 코드를 동작시킨다.
  while (candidate.length > 0) {
    // 랜덤한 값을 shuffle에 push
    shuffle.push(candidate.splice(Math.floor(Math.random() * candidate.length), 1)[0]);
  }
  // 맨 마지막 bonusNumber 가져오기
  const bonusNumber = shuffle[shuffle.length - 1];
  // 0 - 6번쨰 숫자를 가져와 오름차순으로 정렬
  const winNumbers = shuffle.slice(0, 6).sort((p, c) => p - c);
  // 값 리턴
  return [...winNumbers, bonusNumber];
}
```

2. 또한 해당 점수를 컴포넌트로 렌더링 해 줄 Ball 컴포넌트가 필요하다.

```jsx
import React, { memo } from "react";

// 컴포넌트를 다른 컴포넌트로 감싸주는 것을 HOC(high order component)라고 한다.
const Ball = memo(({ number }) => {
  let background;
  if (number <= 10) {
    background = "red";
  } else if (number <= 20) {
    background = "orange";
  } else if (number <= 30) {
    background = "yellow";
  } else if (number <= 40) {
    background = "blue";
  } else {
    background = "green";
  }

  return (
    <div className="ball" style={{ background }}>
      {number}
    </div>
  );
});
export default Ball;
```

가장 마지막에 오는 자식 컴포넌트의 경우 보통 PureComponent나 memo를 넣어 불필요한 리렌더링을 방지해준다. 위 코드처럼 컴포넌트를 다른 컴포넌트로 감싸주는 방식을 HOC(high order component)라고 하며, 위와 같은 함수형 컴포넌트는 PureComponent가 아니기 때문에 별도 memo 메서드로 감싸주어야 PureComponent 역할을 한다.

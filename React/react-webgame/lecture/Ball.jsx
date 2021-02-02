import React, { memo } from "react";

// 컴포넌트를 다른 컴포넌트로 감싸주는 것을 HOC(high order component)라고 한다.
// 함수형 컴포넌트는 PureComponent가 아니기 때문에 별도 memo 메서드로 감싸주어야 PureComponent 역할을 한다.

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

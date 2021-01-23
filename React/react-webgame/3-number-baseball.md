# 숫자야구 만들기

## 3-1. import와 require 비교

1. require

- node의 모듈 시스템

  `const React = require('react');`

  `module.export = React;`

  `export.hello = 'hello';`

2. import

- es2015 모듈 시스템

  `import React from "react";`

  `export default React;`

- export가 배열이나 객체상태이면 구조분해로 import 할 수 있다. 여러개 export 할 수 있다.

  `export const hello` → `export React, { Component, useState, useRef } from "react";`

- module.export와 export default는 호환은 가능하나 완전히 같은 기능은 아니다.
- webpack은 node로 구동하는 것이기 때문에 원래는 Import 문법을 쓰면 에러가 난다.
  하지만 babel이 import도 require로 변환해주기 때문에 사용이 가능한 것이다.
- 따라서 webpack.config.js 쪽에 import 구문을 넣어주면 에러가 난다. 하지만 바벨로 transpile되는 컴포넌트의 경우 import를 사용하는 것이 가능한 것이다.

## 3-2. 리액트 반복문(map)

- 반복되는 데이터는 배열로 만든 뒤 Map함수를 이용해 li tag로 mapping해주면 된다.
- 배열을 만드는 방법은 크게 두가지로 나뉜다.
  1. 2차원 배열을 만드는 방법
  2. 객체 배열을 만드는 방법

```jsx
// 예시
import React, { Component } from "react";

class ExampleMap extends Component {
  render() {
    return (
      <>
        <ul>
          {/* 반복되는 데이터는 배열로 만든다. */}
          {/* 1. 2차원 배열을 만드는 방법 */}
          {[
            ["사과", "맛있어"],
            ["바나나", "달아"],
            ["포도", "시다"],
            ["귤", "밍밍하다"],
            ["감", "떫다"],
            ["복숭아", "달고맛있다"],
          ].map((v) => <li><b>{v[0]}</b>: {v[1]}</li>)}

          {/* 2. 객체 배열을 만드는 방법 */}
          {[
            { name: "사과", description: "맛있어" },
            { name: "바나나", description: "달아" },
            { name: "포도", description: "시다" },
            { name: "귤", description: "밍밍하다" },
            { name: "감", description: "떫다" },
            { name: "복숭아", description: "달고맛있다" },
          ].map((v) => (
            <li>{v.name}-{v.description}</li>
        </ul>)}
      </>
    );
  }
}

export default ExampleMap;
```

## 3-3. 리액트 반복문(key)

- key에 map의 두번째 인자(i)를 적으면 안되는 이유?

  i가 고유해보이지만, 실제로는 고유하지 않다. React에서는 key를 기준으로 엘리먼트를 CRUD하기 때문에 배열의 순서가 바뀌어버리면 문제가 생긴다. 이에 따라 거시적 관점에서 성능 최적화의 문제가 있으므로 최대한 쓰지 않고 데이터를 조합하거나 유일한 값을 key값으로 넣어주는게 좋다.

```jsx
// 예시
import React, { Component } from "react";

class ExampleKey extends Component {
  render() {
    return (
      <>
        <ul>
          {[
            { name: "사과", description: "맛있어" },
            { name: "바나나", description: "달아" },
            { name: "포도", description: "시다" },
            { name: "귤", description: "밍밍하다" },
            { name: "감", description: "떫다" },
            { name: "복숭아", description: "달고맛있다" },
          ].map((v, i) => (
						{/* key 값은 유일한 값을 넣어준다! */}
            <li key={v.name + v.description}>
              {v.name}-{v.description}
            </li>
					)}
        </ul>
      </>
    );
  }
}

export default ExampleKey;
```

## 3-4. 컴포넌트 분리와 props

- 컴포넌트 분리

  map 함수 등을 통해 리턴하는 데이터의 양이 많아지면 렌더링할 데이터는 별도의 컴포넌트로 분리해주는 것이 좋다. 긴 코드를 하나의 코드로 압축해서 노출할 수 있으므로 관심사의 분리, 재사용성, 가독성에도 좋다.

- props로 데이터 상속

  Try 컴포넌트는 ExampleKey 컴포넌트에 있는 데이터를 알지 못하므로 props로 데이터를 상속해야 한다.
  props가 생기면서 부모-자식 관계가 생긴다. 만약 컴포넌트에 Props가 있다면 부모 컴포넌트가 있다는 것을 예측할 수 있다.

```jsx
// Try.jsx
import React, { Component } from "react";

class Try extends Component {
  render() {
    return (
      <li key={this.props.value.name + this.props.value.description}>
        {this.props.value.name}-{this.props.value.description}
        <div>content1</div>
        <div>content2</div>
        <div>content3</div>
      </li>
    );
  }
}

export default Try;
```

```jsx
import React, { Component } from "react";
import Try from "./Try";

class ExampleKey extends Component {
  render() {
    return (
      <>
        <ul>
          {[
            { name: "사과", description: "맛있어" },
            { name: "바나나", description: "달아" },
            { name: "포도", description: "시다" },
            { name: "귤", description: "밍밍하다" },
            { name: "감", description: "떫다" },
            { name: "복숭아", description: "달고맛있다" },
          ].map((v, i) => (
						{/* props로 데이터 상속 */}
						<Try value={v} index={i} />
					)};
        </ul>
      </>
    );
  }
}

export default ExampleKey;
```

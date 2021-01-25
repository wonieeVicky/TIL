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

## 3-5. 주석과 메서드 바인딩

1.  리액트의 JSX 주석은 `{/* */}` 이렇게 사용한다.
2.  이벤트 함수에 화살표 함수를 사용하지 않으면 함수 내부에서 this.state 사용이 안된다.
    this를 찾을 수 없게 된다. (this = undefined)

        ```jsx
        import React, { Component } from "react";

        class Test extends Component {
        	state = {
        		result: "",
        		value: "",
        		answer: getNumbers(),
        		tries: []
        	}

          // const onChangeInput = () => {}
        	onChangeInput(e){
        		this.setState({
        			value: e.target.value // cannot read property 'setState' of undefined!
        		});
        	}

        	render() { // ... }
        }
        ```

        사용할 수 있는 방법이 없는 것은 아니다. constructor super 선언 및 이벤트 함수에 this 바인드해주면 가능

        ```jsx
        import React, { Component } from "react";

        class Test extends Component {
        	constructor(props){
        		super(props);
        		this.state = {
        			result: "",
        			value: "",
        			answer: getNumbers(),
        			tries: []
        		}
        		this.onSubmitForm = this.onSubmitForm.bind(this);
            this.onChangeInput = this.onChangeInput.bind(this);
        	}

        	onSubmitForm(e) {
            e.preventDefault();
            console.log(this.state.value);
          }

          onChangeInput(e) {
            this.setState({
              value: e.target.value
            });
          }

        	render() { // ... }
        }
        ```

        위와 같이 복잡한 코드로 구현하는 방법을 대신하여 arrow function을 통해 this를 자동으로 binding해주면 더욱 간결하게 표현할 수 있다.

        그렇다면 render()도 arrow function으로 바인딩해줘야하지 않을까?
        안해도 된다. 위 extends된 Component가 render를 자동으로 바인딩해주기 때문이다.

## 3-6. 숫자야구 만들기

- React의 불변성

React는 배열 메서드에 값을 추가하는 `push` 메서드를 사용하면 안된다.
React의 컴포넌트가 렌더링하는 기준: 기존 state와 현재 state가 다를 때 리렌더링

만약 아래와 같이 push 메서드를 이용해 직접 array에 값을 변경하면 React는 변경을 감지를 하지 못하므로 원하는 방향으로 동작하지 않는다. 따라서 array2라는 배열을 새롭게 만들어 값을 복사하고 추가해주어야 변경사항을 감지하고 리렌더링을 시작한다. (참조가 바뀌므로)

```jsx
const array = [];
array.push(1); // React가 변경사항에 대한 감지를 못한다.

const array2 = [...array, 1]; // 복사해서 새로운 배열을 만들어줘야 변경사항을 감지할 수 있다.
```

- 숫자야구 만들기

Numberbaseball.jsx

```jsx
import React, { Component } from "react";
import Try from "./Try";

// 숫자 네 개를 겹치지 않고 랜덤하게 리턴하는 함수
const getNumbers = () => {
  const candidate = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const array = [];
  for (let i = 0; i < 4; i += 1) {
    const chosen = candidate.splice(Math.floor(Math.random() * (9 - i)), 1)[0];
    array.push(chosen);
  }
  return array;
};

class NumberBaseball extends Component {
  state = {
    result: "",
    value: "",
    answer: getNumbers(), // ex. [1,3,5,7]
    tries: [] // push 쓰면 안된다.
  };

  onSubmitForm = (e) => {
    const { value, tries, answer } = this.state;
    e.preventDefault();
    if (value === answer.join("")) {
      this.setState({
        result: "홈런!",
        tries: [...tries, { try: value, result: "홈런!" }]
      });
      alert("게임을 다시 시작합니다.");
      this.setState({
        value: "",
        answer: getNumbers(),
        tries: []
      });
    } else {
      const answerArray = value.split("").map((v) => parseInt(v));
      let strike = 0;
      let ball = 0;

      // 10번 이상 틀렸을 때
      if (tries.length >= 9) {
        this.setState({
          result: `10번 넘게 틀려서 실패! 답은 ${answer.join(",")} 였습니다!`
        });
        alert("게임을 다시 시작합니다.");
        this.setState({
          value: "",
          answer: getNumbers(),
          tries: []
        });
      } else {
        for (let i = 0; i < 4; i++) {
          if (answerArray[i] === answer[i]) {
            strike++;
          } else if (answer.includes(answerArray[i])) {
            ball++;
          }
        }
        this.setState({
          tries: [...tries, { try: value, result: `${strike} 스트라이크, ${ball} 볼입니다` }],
          value: ""
        });
      }
    }
  };

  onChangeInput = (e) => {
    this.setState({
      value: e.target.value
    });
  };

  render() {
    const { result, value, tries } = this.state; // 구조분해로 값 간단히 만들기
    return (
      <>
        <h1>{result}</h1>
        <form onSubmit={this.onSubmitForm}>
          <input maxLength={4} value={value} onChange={this.onChangeInput} />
        </form>
        <div>시도: {tries.length}</div>
        <ul>
          {tries.map((v, i) => (
            <Try key={`${i + 1}차 시도 :`} tryInfo={v} index={i} />
          ))}
        </ul>
      </>
    );
  }
}

export default NumberBaseball;
```

Try.jsx

```jsx
import React, { Component } from "react";

class Try extends Component {
  render() {
    const { tryInfo } = this.props;
    return (
      <li>
        <div>{tryInfo.try}</div>
        <div>{tryInfo.result}</div>
      </li>
    );
  }
}

export default Try;
```

## 3-7. Q&A

- `getNumbers()`를 바깥으로 뺀 이유?

this를 사용하지 않는 경우 바깥으로 분리하는게 일반화. 보통 별도 분리된 함수의 경우 다른 위치에서 재사용이 가능하므로 분리하며, 분리된 자체만으로 this에 의존적이지 않다는 것을 알 수 있다.

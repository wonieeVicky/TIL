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
    tries: [], // push 쓰면 안된다.
  };

  onSubmitForm = (e) => {
    const { value, tries, answer } = this.state;
    e.preventDefault();
    if (value === answer.join("")) {
      this.setState({
        result: "홈런!",
        tries: [...tries, { try: value, result: "홈런!" }],
      });
      alert("게임을 다시 시작합니다.");
      this.setState({
        value: "",
        answer: getNumbers(),
        tries: [],
      });
    } else {
      const answerArray = value.split("").map((v) => parseInt(v));
      let strike = 0;
      let ball = 0;

      // 10번 이상 틀렸을 때
      if (tries.length >= 9) {
        this.setState({
          result: `10번 넘게 틀려서 실패! 답은 ${answer.join(",")} 였습니다!`,
        });
        alert("게임을 다시 시작합니다.");
        this.setState({
          value: "",
          answer: getNumbers(),
          tries: [],
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
          value: "",
        });
      }
    }
  };

  onChangeInput = (e) => {
    this.setState({
      value: e.target.value,
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

## 3-8. 숫자야구 Hooks로 전환하기

Numberbaseball.jsx

```jsx
import React, { useState } from "react";
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

const NumberBaseball = () => {
  const [result, setResult] = useState("");
  const [value, setValue] = useState("");
  const [answer, setAnswer] = useState(getNumbers());
  const [tries, setTries] = useState([]);

  const onSubmitForm = (e) => {
    e.preventDefault();
    if (value === answer.join("")) {
      setResult("홈런!");
      setTries((prevTries) => {
        return [...prevTries, { try: value, result: "홈런!" }];
      });

      alert("게임을 다시 시작합니다.");
      setValue("");
      setAnswer(getNumbers());
      setTries([]);
    } else {
      const answerArray = value.split("").map((v) => parseInt(v));
      let strike = 0;
      let ball = 0;

      // 10번 이상 틀렸을 때
      if (tries.length >= 9) {
        setResult(`10번 넘게 틀려서 실패! 답은 ${answer.join(",")} 였습니다!`);
        alert("게임을 다시 시작합니다.");
        setValue("");
        setAnswer(getNumbers());
        setTries([]);
      } else {
        for (let i = 0; i < 4; i++) {
          if (answerArray[i] === answer[i]) {
            strike++;
          } else if (answer.includes(answerArray[i])) {
            ball++;
          }
        }

        setTries((prevTries) => {
          return [...prevTries, { try: value, result: `${strike} 스트라이크, ${ball} 볼입니다` }];
        });
        setValue("");
      }
    }
  };

  const onChangeInput = (e) => {
    setValue(e.target.value);
  };

  return (
    <>
      <h1>{result}</h1>
      <form onSubmit={onSubmitForm}>
        <input maxLength={4} value={value} onChange={onChangeInput} />
      </form>
      <div>시도: {tries.length}</div>
      <ul>
        {tries.map((v, i) => (
          <Try key={`${i + 1}차 시도 :`} tryInfo={v} index={i} />
        ))}
      </ul>
    </>
  );
};

export default NumberBaseball;
```

Try.jsx

```jsx
import React from "react";

const Try = ({ tryInfo }) => {
  return (
    <li>
      <div>{tryInfo.try}</div>
      <div>{tryInfo.result}</div>
    </li>
  );
};

export default Try;
```

## 3-9. React Devtools

props를 활용하다보면 다양한 문제에 직면한다. 가장 큰 문제 중 하나는 잦은 렌더링으로 인한 성능 저하 이슈인데, 이 문제를 찾아내는 방법과 해결하는 방법에 대해 알아보자.

1. 먼저 크롬 확장프로그램인 [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=ko)를 설치한다.
   - 콘솔 창에 React - profiler와 Components가 있는 것을 알 수 있다.
   - Components 탭에서 이벤트 동작에 대한 hooks와 props 데이터를 확인 및 디버깅할 수 있다.
   - 보통 로컬에서 dev로 띄우면 크롬 브라우저 우측 상단에 빨간 색으로 React Devtools에 불이 들어온다.
   - 배포 모드에서는 소스 코드 압축 및 최적화가 되어있고, 파란 색으로 React Devtools에 불이 들어온다.
2. 배포 모드로 바꾸는 방법?

   - webpack.config.js 에서 mode와 node 환경변수를 production으로 설정해준다.

     ```jsx
     process.env.NODE_ENV = "production";

     module.exports = {
     	mode: "production";
     	// ..
     }
     ```

## 3-10. shouldComponentUpdate

성능저하 이슈를 찾아내는 방법에 대해 계속 알아보자.

React는 State와 Props가 업데이트 되면 리렌더링이 된다.
이러한 상황을 확인하는 방법으로 React Devtools의 `Highlight Updates`를 활성화가 시키는 방법이 있는데, 해당 옵션을 키고 컴포넌트를 동작시키면 렌더가 될 때마다 컴포넌트가 반짝거린다.

렌더링이 많아질수록 깜빡거리는 선의 색이 적색으로 바뀐다. 보통 파란색이 원활한 경우이고 노란색 - 녹색 - 빨간색으로 점차 색이 바뀌는데, 이러한 색으로 불필요한 성능 저하가 발생하는 지점을 찾아낼 수 있다.

숫자야구 컴포넌트를 Highlight Updates를 활성화하여 확인해보면 Try 컴포넌트에 변화가 없음에도 계속 렌더링되고 있는 것을 알 수 있다. 이렇게 렌더링이 필요없는 컴포넌트가 불필요하게 리렌더링 되는 경우가 많아질수록 성능저하가 발생한다

화면 리렌더링에 대한 간단한 예제를 확인해보자.

```jsx
// RenderTest.jsx
import React, { Component } from "react";

class Test extends Component {
  state = {
    counter: 0,
  };

  onClick = () => this.setState({});

  render() {
    console.log("렌더링", this.state);
    return (
      <div>
        <button onClick={this.onClick}>클릭</button>
      </div>
    );
  }
}

export default Test;
```

위 코드에서 onClick 메서드에 실제 state를 변경해주는 데이터가 없음에도 버튼을 클릭하면 화면이 리렌더링 된다. State와 Props가 업데이트 되어야지만 리렌더링이 된다고 했던 이야기와는 사뭇 다르다.

이유는 리액트는 그다지 똑똑하지 않아서 단순히 setState함수를 호출하는 것만으로도 업데이트로 인지한다. 때문에 shouldComponentUpdate 함수를 사용하여 어떤 경우에 화면을 다시 그려야 하는지 알려줘야 한다.

```jsx
import React, { Component } from "react";

class Test extends Component {
  // ..

  // shouldComponentUpdate에 변경해야 하는 경우를 정의한다.
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    if (this.state.counter !== nextState.counter) {
      return true;
    }
    return false;
  }

  //..
}
```

위와 같이 shouldComponentUpdate에 화면 리렌더링에 대한 경우를 정의해주면 기존의 리렌더링 문제가 개선되는 것을 확인할 수 있다.

## 3-11. PureComponent와 React.memo

위 shouldComponentUpdate보다 조금 더 간단한 방법도 있다.

1. Class형 컴포넌트를 PureComponent로 바꿔주는 것이다.

   PureComponent는 shouldComponentUpdate를 자동으로 지원하는 컴포넌트라고 할 수 있다.
   어떻게 변화를 감지하여 return true시킬까? 바로 state의 데이터들의 변경을 감지한다.

   ```jsx
   import React, { PureComponent } from "react";

   class Test extends PureComponent {
     state = {
       counter: 0,
     };

     onClick = () => this.setState({});

     render() {
       console.log("렌더링", this.state);
       return (
         <div>
           <button onClick={this.onClick}>클릭</button>
         </div>
       );
     }
   }

   export default Test;
   ```

   단, PureComponent는 Boolean, String, Number 등의 단순 원시타입에 대한 변경 감지는 가능하나 Object나 Array의 변경 감지에는 다소 부족한 면이 있다.

   ```jsx
   import React, { PureComponent } from "react";

   class Test extends PureComponent {
     state = {
       counter: 0,
       string: "hello",
       number: 1,
       boolean: true,
       object: {},
       array: [],
     };

     onClick = () => {
       const array = this.state.array;
       array.push(5);
       // 기존 배열에 새로운 값을 추가할 경우 변경 감지를 못함
       this.setState({
         array,
       });
     };

     render() {
       console.log("렌더링", this.state);
       return (
         <div>
           <button onClick={this.onClick}>클릭</button>
         </div>
       );
     }
   }

   export default Test;
   ```

   위와 같이 배열을 복사하지 않고 기존 배열에 값을 추가하여 setState를 할 경우 같은 배열이라고 인지하여 변경 감지를 하지못해 화면이 렌더링 되지 않는다.

   ```jsx
   import React, { PureComponent } from "react";

   class Test extends PureComponent {
     state = {
       array: [],
     };

     onClick = () => {
       this.setState({
         array: [...this.state.array, 1], // immutable array
       });
     };

     render() {
       console.log("렌더링", this.state);
       return (
         <div>
           <button onClick={this.onClick}>클릭</button>
         </div>
       );
     }
   }

   export default Test;
   ```

   따라서 위와 같이 immutable한 배열을 생성하여 새로운 배열로 만들어주면 변경을 감지하여 리렌더링 된다.
   그리고 되도록이면 state안의 배열이나 객체의 자료구조를 복잡하게 쓰지 않는 것이 좋다.(배열 내 객체, 혹은 배열 내 객체 내 배열 구조 등 이중-삼중 배열 구조) 변경사항 감지에 문제가 발생할 가능성이 높고, 문제를 개선하는데 어려움이 많기 때문이다.

   그렇다면 무조건 PureComponent만 써야할까? 아니다! Component에서 shouldComponentUpdate를 통해 리렌더링 구조에 대한 커스텀이 가능하므로 무조건 쓴다기보단 요구사항에 맞게 사용하면 된다.

2. functional 컴포넌트에서도 memo함수를 이용해 shouldComponentUpdate와 동일한 역할을 하게 만들 수 있다.

   ```jsx
   // Try.jsx
   import React, { memo } from "react";

   const Try = memo(({ tryInfo }) => {
     return (
       <li>
         <div>{tryInfo.try}</div>
         <div>{tryInfo.result}</div>
       </li>
     );
   });

   export default Try;
   ```

   ```jsx
   // NumberBaseball.jsx
   import React, { useState, memo } from "react";
   import Try from "./Try";

   const getNumbers = () => { // ... };

   const NumberBaseball = memo(() => {

   });

   export default NumberBaseball;
   ```

   위 코드와 같이 memo 함수로 컴포넌트를 감싸주면 된다. 자식 컴포넌트가 모두 PureComponent이거나 Memo 함수가 적용되어 있을 경우 부모 컴포넌트도 PureComponent, memo함수를 사용할 수 있다.

   간단해보이지만 항상 적용하는 습관을 들이면 성능 최적화에 큰 도움이 된다.

   ## 3-12. React.createRef

   Class형 숫자야구 코드에서 기존에 ref 메서드를 사용하기 위해서는 아래와 같이 만들었었다.

   ```jsx
   import React, { PureComponent } from "react";

   Class Test from PureComponent {
   	onChange = () => {
   		this.inputRef.focus();
   	}

   	// ref 메서드 선언
   	inputRef;
   	onInputRef = (c) => {
       this.inputRef = c;
   	};

   	render(){
   		return (
   			<>
   				<input ref={this.onInputRef} />
   			</>
   		)
   	}

   }
   ```

   그러나 React.createRef 메서드를 사용하면 Functional 컴포넌트에서 사용하는 useRef와 동일한 메서드로 사용할 수 있다.

   ```jsx
   import React, { PureComponent, createRef } from "react";

   Class Test from PureComponent {
   	onChange = () => {
   		this.inputRef.current.focus();
   	}

   	// ref 메서드 선언 : 간략해짐
   	inputRef = createRef();

   	render(){
   		return (
   			<>
   				<input ref={this.inputRef} />
   			</>
   		)
   	}
   }
   ```

   그렇다고 예전 방식(함수 선언 방식)을 아예 쓰지 않는게 맞을까? 아니다! 함수 선언방식을 활용하면 내부에 console.log나 다른 동작 메서드를 커스텀하여 사용할 수 있기 때문에, 위 PureComponent와 shouldComponentUpdate메서드처럼 필요에 따라 가장 적합한 메서드를 구분해서 사용하면 된다.

   커스텀이 가능하다는 것은 일급 객체, 일급 함수(high order function)를 사용할 수 있다는 뜻으로 함수 안에서 다른 함수를 넣어 커스텀이 가능하다는 의미이다.

   - 커스텀이 가능하다는 것. 어떤 의미일까?

     일급 객체, 일급 함수(high order function)를 사용할 수 있다는 뜻으로
     함수 안에서 다른 함수를 넣어 커스텀이 가능하다는 의미이다.

     ```jsx
     this.setState((prevstate) => { // 다른 함수와 기능을 추가 커스텀할 수 있다. });
     ```

     ```jsx
     class Try extends PureComponent {
       constructor(props) {
         super(props);
         // 아래와 같이 다른 동작, 다른 함수와 기능을 추가 커스텀할 수 있다.
         const filtered = this.props.fileter((i) => i === "vicky");
         this.state = {
           result: filtered,
         };
       }
       render() { ... }
     }

     export default Try;
     ```

## 3-13. props와 state 연결하기

1. render함수 내에서 setState를 사용하면 무한 루프에 빠진다. 렌더 → 상태변경 → 렌더 → 상태변경 ..
   떄문에 절대 render 함수 내에서 setState를 사용하지 않도록 하자!
2. Prop는 직접 값을 바꾸면 안된다. 자식이 직접 Props를 바꿔버리면 부모 컴포넌트의 Props도 뜻하지 않게 바뀌어버리기 때문에 Props 값은 부모 컴포넌트가 바꿔줘야 한다.
   그럼에도 불구하고 Props의 값을 자식 컴포넌트에서 바꿔줘야할 때가 생기는데, 이 때는 어떻게 할까?
3. 바로 Props를 state로 변경하여 그 state를 바꿔준다.

   - Functional 컴포넌트 state 변경 코드

   ```jsx
   import React, { memo, useState } from "react";

   const Try = memo(({ tryInfo }) => {
     // tryInfo.result = 'hello'; :: 직접 값 변경 금지!!
     // 아래와 같이 props를 state로 변경하여 해당 state를 바꿔준다.
     const [result, setResult] = useState(tryInfo.result);

     const onClick = () => setResult("1");

     return (
       <li>
         <div>{tryInfo.try}</div>
         <div onClick={onClick}>{result}</div>
       </li>
     );
   });

   export default Try;
   ```

   - Class 컴포넌트 state 변경 코드

   ```jsx
   import React, { PureComponent } from "react";

   class Try extends PureComponent {
     // 아래와 같이 props를 state로 변경하여 해당 state를 바꿔준다.
     state = {
       result: this.props.tryInfo.result,
       try: this.props.tryInfo.divtry,
     };
     render() {
       return (
         <li>
           <div>{this.state.try}</div>
           <div>{this.state.result}</div>
         </li>
       );
     }
   }

   export default Try;
   ```

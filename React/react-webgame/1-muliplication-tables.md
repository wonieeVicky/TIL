# 구구단 만들기

## 1-1. 리액트는 왜 쓸까?

1. 사용자 경험(UI) 극대화
   리액트는 SPA(Single Page Application)으로, 사용자 인터페이스(UI)를 편하게 만들기 위해서 사용한다.
   페이지 깜박임이 없고, 앱과 비슷한 느낌으로 구현이 가능하며 이를 통해 사용자 경험을 극대화할 수 있다.
2. 데이터-화면 일치
   데이터와 화면과의 상호(일치) 처리를 쉽게 할 수 있다.
3. 재사용이 가능한 컴포넌트
   재사용이 가능한 컴포넌트 단위로 화면을 구성하여 유지보수면에서 효율성이 증대한다. (중복 방지)

## 1-2. 첫 리액트 컴포넌트

아래 ReactDOM이 렌더링하는 순서에 대해 구조를 이해하고, 결과값을 예측할 수 있어야 한다.

```jsx
<html>
  <head>
		<!-- React, ReactDOM CDN 호출 -->
    <script crossorigin src="https://unpkg.com/react@17/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
  </head>
  <body>
    <div id="root"></div><!-- 결과: <div id="root"><button>Like</button></div> -->

    <script>
      const e = React.createElement;
      // React.Component를 상속받는 LikeButton
      class LikeButton extends React.Component {
        // component가 실행될 때 가장 상단에 선언
        constructor(props) {
          super(props);
        }

				// <button>Like</button> 마크업을 만들겠다! (만든다가 아님)
        render() {
          return e("button", null, "Like");
        }
      }
    </script>
    <script>
      // e(LikeButton)을 root 엘리먼트에 렌더링하겠다.
      ReactDOM.render(e(LikeButton), document.querySelector("#root"));
    </script>
  </body>
</html>
```

## 1-3. HTML 속성과 상태(state)

리액트에서는 상태를 관리할 수 있다. 상태는 바뀌는 것으로 초기값을 constructor에서 설정한 뒤 `setState` 메서드로 상태값을 바꿔줄 수 있다.(Like → Liked)

기존에는 jQuery를 통해 셀렉터마다 직접 데이터를 주입하는 방법을 사용했지만, 서비스의 규모가 커질수록 그러한 방법은 지나치게 비효율적이므로 데이터를 상태로 관리하는 방법을 React에서 사용하므로 효율성이 증대했다.

프로그래밍 사고의 변화가 일어나는 순간이다 :)

```jsx
<html>
  <head>
    <script crossorigin src="https://unpkg.com/react@17/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
  </head>
  <body>
    <div id="root"></div>
    <script>
      const e = React.createElement;
      class LikeButton extends React.Component {
        constructor(props) {
          super(props);

          // 상태는 바뀌는 것(Like -> Liked)이며, 상태는 constructor 안에서 설정한다.
          this.state = {
            liked: false,
          };
        }

        // <button onclick="() => { this.setState({ liked: true }) }" type="submit">Like</button>
        render() {
          return e(
            "button",
            {
              onClick: () => {
                this.setState({ liked: true }); // 상태를 바꿔준다.
              },
              type: "submit",
            },
            this.state.liked === true ? "Liked" : "Like" // 원래는 $('button').text('Liked')로 일일히 변경해야 했다.
          );
        }
      }
    </script>
    <script>
      // e(LikeButton)을 root 엘리먼트에 렌더링하겠다.
      ReactDOM.render(e(LikeButton), document.querySelector("#root"));
    </script>
  </body>
</html>
```

## 1-4. JSX와 바벨(babel)

위 LikeButton 컴포넌트의 render 내부를 보면 뭔가 복잡하고 난해하다. 좀 더 쉽고 직관적인 코드 작업을 위해 React에서는 태그형식으로 값을 리턴할 수 있도록 JSX(JS+XML) 문법을 제공한다.

```html
<html>
  <head>
    <script crossorigin src="https://unpkg.com/react@17/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
    <!-- 1. babel cdn -->
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  </head>
  <body>
    <div id="root"></div>

    <!-- 2. script type을 babel로 지정 -->
    <script type="text/babel">
      class LikeButton extends React.Component {
        constructor(props) {
          super(props);
          this.state = {
            liked: false,
          };
        }

        render() {
          // 3. JSX 문법 (JS + XML)
          return (
            <button
              type="submit"
              onClick={() => {
                this.setState({ liked: true });
              }}
            >
              // 4. 중괄호로 내부 스크립트 사용
              {this.state.liked === true ? "Liked" : "Like"}
            </button>
          );
        }
      }
    </script>
    <!-- 2. script type을 babel로 지정 -->
    <script type="text/babel">
      ReactDOM.render(
        <>
          <LikeButton />
        </>,
        document.querySelector("#root")
      );
    </script>
  </body>
</html>
```

1. 해당 JSX문법을 사용하려면 babel이라는 트랜스파일 도구가 필요하다. babel은 시험적인 문법을 지원해준다. cdn으로 head에 추가해준다.
   `<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>`
2. babel을 사용하려면 script type을 `text/babel`로 지정해야 한다.
3. JSX 문법으로 좀 더 알아보기 쉬운 코드로 바꿔준다. 바벨은 JSX 문법을 createElement로 자동으로 변환해준다. (JSX는 모두 createElement라고 보면 된다.)
4. 또한 스크립트 내부에 중괄호`{}`를 감싸주면 그 내부에서 또 스크립트를 작성할 수 있다.

### 1-4-1. 뭐가 나아진걸까?

만약 Like 버튼이 여러개가 필요하다면 리액트 사용 전에는 어떻게 만들 수 있을까?
바로 필요한 만큼 생성하는 방법으로 만들었을 것이다.

```jsx
ReactDOM.render(
  <div>
    <button onClick={onClick}>좋아요</button>
    <button onClick={onClick}>좋아요</button>
    <button onClick={onClick}>좋아요</button>
    <button onClick={onClick}>좋아요</button>
    <button onClick={onClick}>좋아요</button>
  </div>,
  document.querySelector("#root")
);
```

만약 글씨를 수정하거나, onClick 이벤트를 바꾸거나 마크업 안에 추가적인 작업이 필요할 경우 하나하나 모두 수정해주어야 하는 번거로움이 있다. 그러나 리액트로 해당 버튼을 컴포넌트화하면 LikeButton 컴포넌트 하나만 수정해주면 되므로 재사용성이 매우 높다고 볼 수 있다.

글씨가 바뀔 때마다 다 바꿔줘야 함, 그러나 리액트로 컴포넌트화하면 수정사항이 생겼을 때, LikeButton 컴포넌트 하나만 수정해주면 된다. 단 하나의 컴포넌트를 수십번 사용할 수 있는 것이다. 이를 보고 재사용성이 높다라는 이야기를 하곤 한다.

```jsx
ReactDOM.render(
  <div>
    <LikeButton />
    <LikeButton />
    <LikeButton />
    <LikeButton />
  </div>,
  document.querySelector("#root")
);
```

## 1-6. 구구단 리액트로 만들기

이제 구구단 컴포넌트를 리액트로 구현해보자!
ReactDOM 내부에 GuGuDan 컴포넌트를 렌더링 한뒤 해당 컴포넌트를 아래와 같이 작성한다.

```jsx
<html>
  <head>
    <script crossorigin src="https://unpkg.com/react@17/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  </head>
  <body>
    <div id="root"></div>

    <script type="text/babel">
      class GuGuDan extends React.Component {
        constructor(props) {
          super(props);
          // 1. 상태가 변경되는 값 초기 설정
          this.state = {
            first: Math.ceil(Math.random() * 9),
            second: Math.ceil(Math.random() * 9),
            value: "",
            result: "",
          };
        }

        render() {
          return (
            <div>
              <div>
                {this.state.first}곱하기 {this.state.second}는?{/* 2. 상태 값 추가 */}
              </div>
              <form>
                {/* 3. JSX에서는 single tag의 경우 꼭 태그를 닫아주어야 한다. */}
		            {/* 4. form 안의 input은 JSX 내에서 직접 값 변경이 되지 않으므로 onChange 메서드 안에서 실행시켜줘야 한다. */}
                <input
                  type="number"
                  value={this.state.value}
                  onChange={(e) => this.setState({ value: e.target.value })}
                />
                <button>입력!</button>
              </form>
              <div>{this.state.result}</div>{/* 2. 상태 값 추가 */}
            </div>
          );
        }
      }
    </script>
    <script type="text/babel">
      ReactDOM.render(
        <>
          <GuGuDan />
        </>,
        document.querySelector("#root")
      );
    </script>
  </body>
</html>
```

1. 상태가 변경될 값들의 초기값을 constructor 안에서 설정한다.
   크게 첫번째 곱셈 값, 두번째 곱셈 값, 입력 값, 결과 값의 상태가 변경되므로 총 4개의 객체값을 넣는다.
2. 상태값을 JSX 문법에 중괄호를 이용하여 넣는다.
3. JSX에서는 input 태그 등 single tag를 사용할 경우 반드시 태그를 닫아주어야 한다.
4. JSX 내에서 직접 값 변경은 불가하므로 onChange 메서드를 넣어 데이터 변경에 대한 상태값을 변경해준다.
   덧, 수동으로 바꿀 값만 setState로 바꿔준다.
   `onChange={(e) ⇒ this.setState({ value: e.target.value })}`

## 1-7. 클래스 메서드

클래스 메서드로 각종 상태 변경 이벤트를 관리해보자.

```jsx
<html>
  <head>
    <script crossorigin src="https://unpkg.com/react@17/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  </head>
  <body>
    <div id="root"></div>

    <script type="text/babel">
      class GuGuDan extends React.Component {
        constructor(props) {
          super(props);
          this.state = {
            first: Math.ceil(Math.random() * 9),
            second: Math.ceil(Math.random() * 9),
            value: "",
            result: "",
          };
        }

				// 1. form submit 이벤트
        onSubmit = (e) => {
          e.preventDefault();
          if (parseInt(this.state.value) === this.state.first * this.state.second) {
            this.setState({
              result: `${this.state.first * this.state.second} 정답!`, // 3. 메서드 변형
              first: Math.ceil(Math.random() * 9),
              second: Math.ceil(Math.random() * 9),
              value: "",
            });
          } else {
            this.setState({
              result: "땡",
              value: "",
            });
          }
        };

				// 2. input onchange 이벤트 분리
        onChange = (e) => this.setState({ value: e.target.value });

        render() {
          return (
            <div>
              <div>
                {this.state.first}곱하기 {this.state.second}는?
              </div>
              <form onSubmit={this.onSubmit}>
                <input type="number" value={this.state.value} onChange={this.onChange} />
                <button>입력!</button>
              </form>
              <div>{this.state.result}</div>
            </div>
          );
        }
      }
    </script>
    <script type="text/babel">
      ReactDOM.render(
        <>
					{/* 4. 컴포넌트 재사용 */}
          <GuGuDan />
          <GuGuDan />
          <GuGuDan />
        </>,
        document.querySelector("#root")
      );
    </script>
  </body>
</html>
```

1. form submit 이벤트를 클래스 메서드로 구현한다.
   JSX내에 포함시킬수도 있으나 코드의 복잡도가 높아지므로 스크립트 작성은 최대한 클래스 메서드로 분리하여 작성하는 것이 권장된다. `<form onSubmit={this.onSubmit}}></form>`
2. input onchange 이벤트도 1번과 같이 클래스 메서드로 구현한다.
   `<input onChange={this.onChange} />`
3. 결과 값을 노출할 때 데이터를 포함시키려면 [Template Literals](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Template_literals)를 사용하면 편리하게 작업이 가능하다!
4. 생성한 GuGuDan 컴포넌트를 여러개 생성할 수도 있다. 컴포넌트마다 개별로 동작하므로 각자의 state를 가진다. 때문에 각 구구단 컴포넌트가 독립적으로 움직일 수 있다.

## 1-8. Fragment와 기타 팁들

```jsx
<html>
  <head>
    <script crossorigin src="https://unpkg.com/react@17/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  </head>
  <body>
    <div id="root"></div>

    <script type="text/babel">
      class GuGuDan extends React.Component {
        // 1. constructor 꼭 사용해야 하나
        constructor(props) {
          super(props);
          this.state = {
            first: Math.ceil(Math.random() * 9),
            second: Math.ceil(Math.random() * 9),
            value: "",
            result: "",
          };
        }

        // 2. JSX와 직접적인 연관이 있는 이벤트 함수의 경우 반드시 arrow function으로 구현한다.
        onSubmit = (e) => {
          e.preventDefault();
          if (parseInt(this.state.value) === this.state.first * this.state.second) {
            this.setState({
              result: `${this.state.first * this.state.second} 정답!`,
              first: Math.ceil(Math.random() * 9),
              second: Math.ceil(Math.random() * 9),
              value: "",
            });
          } else {
            this.setState({
              result: "땡",
              value: "",
            });
          }
        };

        onChange = (e) => this.setState({ value: e.target.value });

        render() {
          return (
            // 3. 리액트는 컴포넌트 최상단을 항상 감싸줘야 한다.
            <>
              <div>
                {this.state.first}곱하기 {this.state.second}는?
              </div>
              <form onSubmit={this.onSubmit}>
                <input type="number" value={this.state.value} onChange={this.onChange} />
                <button type="submit">입력!</button>
                {/* 4. form 태그가 없을 경우? */}
              </form>
              <div>{this.state.result}</div>
            </>
          );
        }
      }
    </script>
    <script type="text/babel">
      ReactDOM.render(
        <>
          <GuGuDan />
        </>,
        document.querySelector("#root")
      );
    </script>
  </body>
</html>
```

1. constructor없이 사용해도 상관없다. `state = { ... }`
2. JSX와 직접적인 연관이 있는 이벤트 함수의 경우 (예를 들어 input value를 가져온다던지 하는..) 반드시 arrow function으로 구현해야 한다. this의 값이 달라지기 때문이다. arrow function은 this의 값을 클로저로 가둬주므로 값 변질이 없다.
3. 리액트 render 시 전체를 감싸주어야 한다. 보통 `<>{/* code .. */}</>` 작성하지만,
   안되는 경우 `<React.Fragment>{/* code .. */}</React.Fragment>`로 작성할 수도 있다.
4. 만약 form 태그 없이 input submit을 해야할 경우 button에 onClick 이벤트를 사용해 구현한다.
   `<button type="submit" onClick={onSubmit}>입력!</button>`

## 1-9. 함수형 setState

우리는 예전값으로 새로운 state를 만들 때에는 반드시 return 함수를 사용해야 한다.
setState시 함수형으로 return 하여 setState 하는 방법이 있는데 아래 `onSubmit` 이벤트의 setState 동작 부분 예시를 보자. 기존 코드와 다른 점은 prevState(예전 값)를 받아 return 시 바뀔 상태값을 넣어주는 구조로 변형된 점이다.

```jsx
onSubmit = (e) => {
  e.preventDefault();
  if (parseInt(this.state.value) === this.state.first * this.state.second) {
    // prevState란 예전 상태값, return에는 바뀔 상태값이 담긴다.
    this.setState((prevState) => {
      return {
        result: `${prevState.value} 정답!`,
        first: Math.ceil(Math.random() * 9),
        second: Math.ceil(Math.random() * 9),
        value: "",
      };
    });
  } else {
    this.setState({
      result: "땡",
      value: "",
    });
  }
};
```

왜 이렇게 해야할까?

아래와 같이 숫자를 세는 counter 이벤트가 있다고 치자. 우리는 새로운 value가 기존 value + 3이 되기를 원하며 아래와 같이 코드를 작성하지만, 이는 +3이 될 수도 있고, + 1이 될 수도 있다. 왜냐면 **setState는 비동기**이기 때문이다.

```jsx
onChange = (e) => {
  e.preventDefault();
  this.setState({
    value: this.state.value + 1,
  });
  this.setState({
    value: this.state.value + 1,
  });
  this.setState({
    value: this.state.value + 1,
  });
};
```

따라서 예전값(prevState)로 새로운 state를 만들 때엔 반드시 return 함수를 사용하도록 한다.

```jsx
onChange = (e) => {
	  e.preventDefault();
    this.setState((prevState)=>{
      value: prevState.value + 1,
    })
};
```

## 1-10. ref

React는 상태의 변경사항에 따라 화면을 리렌더링하는 마법을 부린다. 만약 값을 입력할 때마다 input에 focus를 하고 싶다면 어떻게 해야할까? document.querySelector('input').focus()라는 방법을 쓰기보다는 리액트가 화면을 컨트롤 할 수 있도록 해주는 것이 좋다. 화면은 리액트가 핸들링하고 우리는 데이터만 바꿔주는 것이다.

이렇게 돔에 직접 접근하고 싶을 때는 ref 메서드를 사용한다.

```jsx
<html>
  <head>
    <script crossorigin src="https://unpkg.com/react@17/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  </head>
  <body>
    <div id="root"></div>

    <script type="text/babel">
      class GuGuDan extends React.Component {
        constructor(props) {
          super(props);
          this.state = {
            first: Math.ceil(Math.random() * 9),
            second: Math.ceil(Math.random() * 9),
            value: "",
            result: "",
          };
        }

        onSubmit = (e) => {
          e.preventDefault();
          if (parseInt(this.state.value) === this.state.first * this.state.second) {
            this.setState((prevState) => {
              return {
                result: `${prevState.value} 정답!`,
                first: Math.ceil(Math.random() * 9),
                second: Math.ceil(Math.random() * 9),
                value: "",
              };
            });
          } else {
            this.setState({
              result: "땡",
              value: "",
            });
          }
					// 2. ref 동작
          this.input.focus();
        };

        onChange = (e) => this.setState({ value: e.target.value });

				// 1. ref 이벤트 생성
        onRefInput = (c) => { this.input = c; };

        render() {
          // 3. console.log("렌더링");
          return (
            <>
              <div>
                {this.state.first}곱하기 {this.state.second}는?
              </div>
              <form onSubmit={this.onSubmit}>
                <input ref={this.onRefInput} type="number" value={this.state.value} onChange={this.onChange} />
                <button type="submit">입력!</button>
              </form>
              <div>{this.state.result}</div>
            </>
          );
        }
      }
    </script>
    <script type="text/babel">
      ReactDOM.render(
        <>
          <GuGuDan />
        </>,
        document.querySelector("#root")
      );
    </script>
  </body>
</html>
```

1. ref 이벤트 또한 onSubmit, onChange 이벤트처럼 별도로 이벤트를 생성해준다. 인자값은 아무거나 적어도 상관없다. ref 메서드는 reference의 줄임말로 해당 엘리먼트를 참조하겠다는 의미이다.
2. 생성해놓은 ref인 this.input은 필요한 구간에서 동작시키면 된다. `this.input.focus();`
3. 해당 영역에 콘솔을 찍고 기능을 구동해보면 setState가 동작할 때마다 render함수가 재실행되는 것을 확인할 수 있다. 때문에 너무 잦은 setState는 render 함수를 지나치게 많이 재실행하여 사이트 동작이 느려질 수 있다.

## 1-11. React Hooks 사용하기

- Hooks는 함수형 컴포넌트에서 사용한다.
  - 기존에는 상태를 변경하는 동작(setState 등)이 없을 경우 함수형 컴포넌트를 썻으나, 리액트가 함수형 컴포넌트에도 상태 변경 메서드를 지원하면서 요즘 주로 함수형으로 개발한다.
  - 함수형 컴포넌트에서 상태 변화를 할 수 있도록 하는 메서드가 바로 Hooks이다.
- Hooks 는 보통 앞에 `use-`가 붙는다. useState. useEffect, useRef..
  - 함수형 컴포넌트와 훅스를 이용하면 기존 클래스컴포넌트보다 훨씬 간결하게 만들 수 있다.
- 구구단 컴포넌트를 Hooks로 변경해보자.(index-functional.html 참고)

  ```jsx
  const Gugudan = () => {
    // 1. setState 생성
    const [first, setFirst] = React.useState(Math.ceil(Math.random() * 9));
    const [second, setSecond] = React.useState(Math.ceil(Math.random() * 9));
    const [value, setValue] = React.useState("");
    const [result, setResult] = React.useState("");
    // 2. useRef 생성
    const inputRef = React.useRef();

    const onChangeInput = (e) => setValue(e.target.value);
    const onSumbmitForm = (e) => {
      e.preventDefault();
      if (parseInt(value) === first * second) {
        // 3. 이전 값이 필요할 경우
        setResult((prevResult) => `${prevResult} 정답!`);
        setFirst(Math.ceil(Math.random() * 9));
        setSecond(Math.ceil(Math.random() * 9));
        setValue("");
      } else {
        setResult("땡");
        setValue("");
      }
      inputRef.current.focus();
    };

    return (
      <>
        <div>
          {first} 곱하기 {second} sms?
        </div>
        <form>
          <input ref={inputRef} onChange={onChangeInput} value={value} />
          <button>입력</button>
        </form>
        <div id="result" onSubmit={}>
          {result}
        </div>
      </>
    );
  };
  ```

1. Hooks는 반드시 컴포넌트 안에 넣어주어야 한다.

   구조분해 할당으로 초기값과, 상태변경 메서드가 선언되며, useState()안에 초기값을 넣는다.

   - 상태를 React.useState 안에 객체로 묶어 값을 넣어주면 안될까?

2. ref의 경우 `useRef`라는 메서드를 이용해 생성해준다.
3. 이전 값이 필요할 경우 클래스 컴포넌트와 비슷하게 return 형태로 이전 값을 인자로 받아올 수 있다.

## 1-12. Class와 Hooks 비교하기

- state 선언방식이 다르다. this.setState({}) ↔ setValue()
- 함수형 컴포넌트에서 Hooks로 State 변경할 때마다 컴포넌트 전체가 재실행되므로 조금 느릴 수 있다.
  - 다만 Hooks setState시 React는 비동기로 상태변화를 실행시키므로 setState를 한번에 여러번 한다고 해도 렌더링은 한번만 일어난다.
  - Class 컴포넌트는 Render 영역만 재렌더링

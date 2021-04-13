# Mobx-react

mobX는 워낙 자유로운 라이브러리이므로 React에 적용하는 방법이 굉장히 다양하다.  
현재 구축하는 방법은 하나의 방법일 뿐이므로 확장된 시야로 붙여보자 !

`mobx-react/package.json`

```json
{
  "name": "mobx-react-playground",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "webpack serve --env development"
  },
  "author": "vicky",
  "license": "ISC",
  "dependencies": {
    "mobx": "^6.1.8", // 추가
    "mobx-react": "^7.1.0", // 추가
    "react": "^17.0.2",
    "react-dom": "^17.0.2"
  },
  "devDependencies": {
    "@babel/core": "^7.12.10",
    "@babel/plugin-proposal-class-properties": "^7.12.1",
    "@babel/plugin-proposal-decorators": "^7.13.5", // 추가
    "@babel/preset-env": "^7.12.11",
    "@babel/preset-react": "^7.12.10",
    "@pmmmwh/react-refresh-webpack-plugin": "^0.4.3",
    "babel-loader": "^8.2.2",
    "react-refresh": "^0.9.0",
    "webpack": "^5.16.0",
    "webpack-cli": "^4.4.0",
    "webpack-dev-server": "^3.11.2"
  }
}
```

`mobx-react/webpack.config.js`

```jsx
module.exports = {
  // settings..
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        options: {
          presets: [
            // settings..
          ],
          plugins: [
            ["@babel/plugin-proposal-decorators", { legacy: true }], // 추가
            ["@babel/plugin-proposal-class-properties", { loose: true }], // 추가
            "react-refresh/babel",
          ],
        },
        exclude: path.join(__dirname, "node_modules"),
      },
    ],
  },
  // settings..
};
```

위와 같이 mobX를 위한 프로젝트 설정이 끝나면 가장 먼저 App.js를 만들어준다. 기존 프로젝트에서 진행했던 애플리케이션을 mobX로 적용해보는 작업을 진행할 것임

## 클래스 컴포넌트에 적용해보는 Mobx

`mobx-react/App.js`

```jsx
import React, { Component } from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { userStore, postStore } from "./store"; // 2. store 데이터 호출

@observer // 1. class 컴포넌트에서 사용하는 decorator
class App extends Component {
  onLogIn = () => {};
  onLogOut = () => {};
  onChangeName = (e) => (this.state.name = e.target.value);
  onChangePassword = (e) => (this.state.password = e.target.value);

  render() {
    return (
      <div>
        {userStore.isLoggingIn ? (
          <div>로그인 중입니다.</div>
        ) : userStore.data ? (
          <div>{userStore.data.nickname}</div>
        ) : (
          "로그인 해주세요"
        )}
        {!userStore.data ? (
          <button onClick={this.onLogIn}>로그인</button>
        ) : (
          <button onClick={this.onLogout}>로그아웃</button>
        )}
        <div>{postStore.data.length}</div>
        <div>
          <input value={this.state.name} onChange={this.onChangeName} />
          <input value={this.state.password} type="password" onChange={this.onChangePassword} />
        </div>
      </div>
    );
  }
}

export default App;
```

1. `@observer` ~~데코레이터는 주로 클래스 컴포넌트에서 사용할 수 있는데~~, 기존에 HOC로 감싸줘야 했던 것들을 데코레이터를 이용해 최상단에 선언해주면 HOC와 같이 App 컴포넌트에 observer 함수가 감싸진다.
   데코레이터는 아무데나 막 쓸 수는 없고, 클래스 컴포넌트에서 주로 사용하며, 일반 객체 리터럴에서는 직접 HOC 형태로 감싸주어야 한다.
   (데코레이터 문법`@`은 아직 실험적인 단계이므로 섣불리 사용해선 안된다. 또한 사용하기 전에 tsconfig.json이나 jsconfig.json에서 `experimentalDecorators`를 활성화 처리를 해주는 방법이나 vsCode 등의 기본 설정에서 JS/TS 설정 중 `Implicit Project Config: Experimental Decorators` 를 활성화 해주어야 문법 오류 없이 적용된다. ⇒ MobX6에서 데코레이터가 사라졌으므로 앞으로 데코레이터는 사용하지 않는다)
2. mobX에서는 반드시 하나의 스토어만 가질 필요가 없으므로 선언한 두 개의 store를 임포트 해온다. 그러면 위 코드처럼 직접적으로 userStore, postStore에 접근이 가능함. 만약 예전 문법인 Provider와 inject 메서드로 store를 가져올 경우 @inject('userStore')로 선언 후 class 컴포넌트 내에서 this.props.userStore로 접근이 가능하다. (굳이 이렇게 쓸 일이 없으므로 import로 받아와 처리한다.)

`mobx-react/store.js`

```jsx
const { observable } = require("mobx");

// 1. 일반 객체 리터럴 - obsevable HOC
const userStore = observable({
  isLoggingIn: false,
  data: null,
  logIn(data) {
    this.isLoggingIn = true;
    setTimeout(() => {
      this.data = data;
      this.isLoggingIn = false;
      postStore.data.push(1); // 2. redux에 비해 편한 점
    }, 2000);
  },
  logOut() {
    this.data = null;
  },
});

const postStore = observable({
  data: [],
  addPost(data) {
    this.data.push(data);
  },
});

export { userStore, postStore };
```

1. 위 클래스 컴포넌트가 decorator를 통해 HOC를 구현했다면 일반 객체 리터럴은 직접 HOC 형태로 초기데이터를 감싸주어야 한다.
2. 이 부분이 redux에 비해 mobX가 편한 점이라고 할 수 있다. 바로 userStore에서 postStore의 데이터를 바꿀 수 있다는 것. 만약 리덕스에서 해당 액션을 구현하려면 다른 액션을 구현하여 이어붙여주도록 처리하는 방법 밖에 없다. 그러나 mobX에서는 아주 간단히 처리할 수 있음

실제 App 컴포넌트에서 로그인 버튼 클릭 시 2초 후 로그인이 되면서 postData가 1씩 증가하는 것을 볼 수 있다. store에서 userData 내 logIn 동작 처리 시 postData의 값들도 한번에 처리할 수 있음을 보여주는 예시이다

---

### (참고) Mobx Model 라이브러리

Mobx에서 Model Layer를 구현하는데 순수 Class형태로 구현이 가능하지만 Model 라이브러리를 사용하면 라이브러리에서 제공하는 기능들을 사용할 수 있음

- MobX-State-Tree(MST) : Mobx를 리액트에서 사용할 때 tree구조로 체계를 잡아갈 수 있도록 하는 디자인 패러다임, Mobx는 상태관리 "엔진"이고, MobX-State-Tree는 앱에 필요한 구조와 공통 도구를 제공

## 함수형 컴포넌트에 적용해보는 Mobx

클래스 컴포넌트로 만들었던 App 컴포넌트를 함수형으로도 구현하면 아래와 같다.

`App.js`

```jsx
import React, { useCallback } from "react";
import { useObserver, useLocalObservable, observer } from "mobx-react";
import { userStore, postStore } from "./store";

const App = () => {
  // 1. state 관리를 위한 useLocalStore 사용
  const state = useLocalObservable(() => ({
    name: "",
    password: "",
    onChangeName(e) {
      this.name = e.target.value;
    },
    onChangePassword(e) {
      this.password = e.target.value;
    },
  }));

  const onLogIn = useCallback(() => userStore.logIn({ nickname: "vicky", password: 123 }), []);
  const onLogOut = useCallback(() => userStore.logOut(), []);

  return (
    <div>
      {userStore.isLoggingIn ? (
        <div>로그인 중입니다.</div>
      ) : userStore.data ? (
        <div>{userStore.data.nickname}</div>
      ) : (
        "로그인 해주세요"
      )}
      {!userStore.data ? <button onClick={onLogIn}>로그인</button> : <button onClick={onLogOut}>로그아웃</button>}
      <div>{postStore.data.length}</div>
      <div>
        <input value={state.name} onChange={state.onChangeName} />
        <input value={state.password} type="password" onChange={state.onChangePassword} />
      </div>
    </div>
  );
};

// 2. 함수형 컴포넌트는 Observer를 HOC 형태로 써준다.
export default observer(App);
```

1. 컴포넌트 내부에서 state를 관리해야 할 경우 mobx-react에서 제공하는 useLocalStore 훅을 사용한다. 해당 훅 내부에 사용해야할 state와 클릭이벤트 함수등을 모두 넣어서 처리해준다.
   (useState를 사용하면 불변성을 지켜주며 값을 바꿔줘야 하므로 번거롭기 때문에 사용하지 않을 뿐 useLocalStore 대신 사용해도 무방하다.)
2. 함수형 컴포넌트는 기존 클래스 컴포넌트의 decorator`@`를 사용할 수 없으므로 ~~mobx-react에서 제공하는useObserver 훅을 return 시 감싸서 처리하면 해당 컴포넌트 내에 mobx observer가 적용된다.~~
   MobX6에서 useObserver를 사용하지 않고 HOC형태로 observer로 감싸주도록 변경되었다.

한가지 짚고 넘어갈 점.
App 컴포넌트에서 store는 모두 글로벌 스토어에서 직접 데이터를 받아와 사용하는 방식을 채택했다.

위 경우와 달리 store를 가져오는 것을 별도로 분리하고 싶다면 아래와 같이 구현할 수도 있다.  
(위 클래스형 컴포넌트에서 Inject와 Provider로 구현한 것과 비슷한 방식의 함수형 컴포넌트 형태)

1. 먼저 Context와 Provider 함수를 구현해야 한다.

   `mobx-react/Context.jsx`

   ```jsx
   import React from "react";
   import { userStore, postStore } from "./store";

   export const storeContext = React.createContext({ userStore, postStore });

   const StoreProvider = ({ children }) => {
     return <storeContext.Provider>{children}</storeContext.Provider>;
   };

   export default StoreProvider;
   ```

2. 그런 뒤 생성한 Provider를 client.jsx의 시작 컴포넌트에 감싸준다.

   `mobx-react/client.jsx`

   ```jsx
   import React from "react";
   import ReactDOM from "react-dom";
   import App from "./App";
   import StoreProvider from "./Context";

   ReactDOM.render(
     <StoreProvider>
       <App />
     </StoreProvider>,
     document.querySelector("#root")
   );
   ```

3. 다음 state를 가져올 커스텀 훅을 생성해준다.

   `mobx-react/useStore.js`

   ```jsx
   import React from "react";
   import { storeContext } from "./Context";

   function useStore() {
     const { userStore, postStore } = React.useContext(storeContext);

     return { userStore, postStore };
   }

   export default useStore;
   ```

4. 만든 커스텀 훅으로 App 컴포넌트에서 state를 호출하여 사용한다.

   `mobx-react/App.jsx`

   ```jsx
   import React, { useCallback } from "react";
   import { useObserver, useLocalObservable } from "mobx-react";
   import useStore from "./useStore";

   const App = () => {
     const { userStore, postStore } = useStore(); // useStore를 통해 userStore, postStore를 호출
     // codes..

     return useObserver(() => <div>{/* codes.. */}</div>);
   };

   export default App;
   ```

이렇게 Mobx에서 Context API와 조합하여 state를 훅으로 가져오는 방법을 알아봤다. 해당 내용으로 구현하기 위해서는 별도의 ContextAPI를 이용한 StoreProvider를 생성해야 하는 점, 별도의 데이터를 가져올 커스텀 훅을 만들어야 한다는 점이 번거롭게 느껴진다. 굳이 이렇게 만들 필요가 있을까? `import { userStore, postStore } from "./store";` 이 한줄로 모든 것이 해결되므로 위 방법이 있다는 정도로만 알아두자 !

## 엄격 모드와 기타 기능들

자유로운 상태관리라이브러리인 Mobx를 엄격하게 사용할 수 있다.  
특정 액션에 대한 것에 반드시 action에 가두어 사용해야 하는 등 몇가지 엄격한 규칙이 생긴다.

`mobx-react/store.js`

```jsx
const { observable, configure } = require("mobx");

configure({ enforceActions: "always" }); // Mobx를 엄격모드로 활성화 해준다.

// stores..
export { userStore, postStore };
```

위와 같이 store 생성시 `enforceAcitons` 속성값을 `always`로 주면 엄격모드가 활성화 된다.  
App 컴포넌트에서 액션 동작 시 runInAction이나 action으로 감싸주는 형태로 감싸주어야 정상 동작한다.

```jsx
import { action, runInAction } from "mobx";

const App = () => {
  const state = useLocalObservable(() => ({
    name: "",
    password: "",
    onChangeName: (e) => runInAction(() => (state.name = e.target.value)),
    onChangePassword: action((e) => (state.password = e.target.value)),
  }));

	return (<>{/* codes.. */}</>)
})
```

### useAsObservableSource로 props를 Observable로 만들기

mobx-react에서 제공되는 메서드인 useAsObservableSource는 observable이 아닌 데이터,  
예를 들어 부모로 부터 상속받는 데이터 등에 obsevable를 부여하고 싶을 때 사용하는 메서드이다.

```jsx
import { useAsObservableSource } from "mobx-react";

const PersonSource = ({ name, age }) => {
  const person = useAsObservableSource({ name, age });
  return <PersonBanner person={person} />;
};
```

### computed로 캐싱 적용하기

Mobx의 state가 바뀌면 화면은 리렌더링된다. 만약 컴포넌트에 바뀌는 state값이 다양할 경우 리렌더링 시마다 불필요하게 함수가 재동작하는 이슈가 많이 발생하는데 이때 Mobx에서 사용 가능한 방법으로 getter 함수를 활용한 computed 캐싱을 구현하는 것이다. 아래 코드를 보자

`mobx-react/store.js`

```jsx
const { observable, configure } = require("mobx");

const postStore = observable({
  data: [],
  addPost(data) {
    this.data.push(data);
  },
  // 1. getter 활용
  get postLength() {
    return this.data.length;
  },
  // 2. setter 활용
  set post(value) {
    this.data = value;
  },
});

export { userStore, postStore };
```

1. getter를 활용한 computed 역할을 하는 함수를 생성하는 방법이다. 앞에 get이라는 프리픽스를 넣어 computed 함수임을 지정하는데, 의존된 데이터(this.data)가 바뀌기 전까지는 캐싱을 통해 같은 값을 사용하여 불필요한 연산을 줄일 수 있다! 따라서 Mobx에서는 getter를 활용하여 성능 최적화를 할 수 있으며 복잡한 연산일 경우 더더욱 도입을 하는 것이 바람직하다.
2. setter를 활용한 함수도 생성 가능 !

### login 시 콘솔에 나오는 warning 제거하기

App 컴포넌트에서 로그인 버튼을 누르면 아래와 같이 warning 메시지가 콘솔에 기록된다.

```
[MobX] Since strict-mode is enabled, changing (observed) observable values without using an action is not allowed. Tried to modify: ObservableObject@1.data
```

strict-mode에서 action에 함수로 감싸지지 않은 observable 함수가 있다는 의미. 따라서 해당 메서드가 적용되어있지 않은 부분을 찾아 적용해주면 더이상 에러가 발생하지 않는다.

`mobx-react/store.js`

```jsx
const userStore = observable({
  isLoggingIn: false,
  data: null,
  logIn(data) {
    this.isLoggingIn = true;
    setTimeout(
      // action으로 감싸주기
      action(() => {
        this.data = data;
        this.isLoggingIn = false;
        postStore.data.push(1);
      }),
      2000
    );
  },
  logOut() {
    this.data = null;
  },
});
```

## MobX@6에서 바뀐 점

- IE 지원이 가능(configure에서 별도 설정이 필요함)
- 함수형 컴포넌트에서 사용하던 `useLocalStore` → `useLocalObservable`로 바뀌었다.
- 함수형 컴포넌트에서 사용하던 useObserver 가 사라지고 observer로 HOC로 컴포넌트를 감싸주는 방식으로 바뀌었다.

  ```jsx
  import { useLocalObservable, observer } from "mobx-react";

  const Test = () => {
  	const state = useLocalObservable(() => ({
  		name: '',
  		age: '',
  	});
  	// return useObserver(() => {}); 사용하지 않는다.
  	return <div></div>
  }

  export default observer(Test);
  ```

- 데코레이터 문법 모두 사라졌다. 사용하지 않는다.

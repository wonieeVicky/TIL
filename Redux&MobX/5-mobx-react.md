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
  onChangeName = e => (this.state.name = e.target.value);
  onChangePassword = e => (this.state.password = e.target.value);

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
          <input
            value={this.state.password}
            type="password"
            onChange={this.onChangePassword}
          />
        </div>
      </div>
    );
  }
}

export default App;
```

1. `@observer` 데코레이터는 주로 클래스 컴포넌트에서 사용할 수 있는데, 기존에 HOC로 감싸줘야 했던 것들을 데코레이터를 이용해 최상단에 선언해주면 HOC와 같이 App 컴포넌트에 observer 함수가 감싸진다.
   데코레이터는 아무데나 막 쓸 수는 없고, 클래스 컴포넌트에서 주로 사용하며, 일반 객체 리터럴에서는 직접 HOC 형태로 감싸주어야 한다.
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

### (참고) Mobx Model 라이브러리

Mobx에서 Model Layer를 구현하는데 순수 Class형태로 구현이 가능하지만 Model 라이브러리를 사용하면 라이브러리에서 제공하는 기능들을 사용할 수 있음

- MobX-State-Tree(MST) : Mobx를 리액트에서 사용할 때 tree구조로 체계를 잡아갈 수 있도록 하는 디자인 패러다임, Mobx는 상태관리 "엔진"이고, MobX-State-Tree는 앱에 필요한 구조와 공통 도구를 제공

## 함수형 컴포넌트에 적용해보는 Mobx

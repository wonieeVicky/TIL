## 폴더 구조와 리액트 라우터 설정

### 폴더 구조에 대하여

이번 프로젝트에서 폴더 구조는 front 폴더 하위에 서비스 페이지 정보를 담는 pages와 각종 컴포넌트들을 모아놓는 components 그리고 공통 레이아웃을 넣어두는 layouts 그리고 utils, hooks, typings 등으로 분리해서 작업한다. 폴더구조는 서비스의 특성을 살려 최적화시켜서 사용하면 된다.
또 pages 폴더의 각종 페이지는 `index.tsx`와 `styles.tsx`로 분리하여 작업한다.

그리고 alias로 webpack 과 tsconfig에 설정해놓은 정보들은 파일 작업 시 아래와 같이 import 시킬 수 있음

`webpack.config.ts`

```tsx
const config: Configuration = {
  name: "sleact",
  mode: isDevelopment ? "development" : "production",
  devtool: !isDevelopment ? "hidden-source-map" : "eval",
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
    alias: {
      "@hooks": path.resolve(__dirname, "hooks"),
      "@components": path.resolve(__dirname, "components"),
      "@layouts": path.resolve(__dirname, "layouts"),
      "@pages": path.resolve(__dirname, "pages"),
      "@utils": path.resolve(__dirname, "utils"),
      "@typings": path.resolve(__dirname, "typings"),
    },
  },
  // ...
};
```

`tsconfig.json`

```json
{
  "compilerOptions": {
    // ..
    "baseUrl": ".",
    "paths": {
      "@hooks/*": ["hooks/*"],
      "@components/*": ["components/*"],
      "@layouts/*": ["layouts/*"],
      "@pages/*": ["pages/*"],
      "@utils/*": ["utils/*"],
      "@typings/*": ["typings/*"]
    }
  }
}
```

위 설정은 아래와 같이 쓰인다.

`client.tsx`

```tsx
import React from "react";
import { render } from "react-dom";
import App from "@layouts/App";

render(<App />, document.querySelector("#app"));
```

### 라우터 적용

```bash
$ npm i react-router react-router-dom
$ npm i -D @types/react-router @types/react-router-dom
```

라우터 연결할 로그인 컴포넌트와 회원가입 컴포넌트를 간단하게 만들어둔다.

`front/pages/Login/index.tsx`

```tsx
import React from "react";

const LogIn = () => {
  return <div>로그인</div>;
};

export default LogIn;
```

`front/pages/SignUp/index.tsx`

```tsx
import React from "react";

const SignUp = () => {
  return <div>회원가입</div>;
};

export default SignUp;
```

그리고 라우터를 적용해준다.

`front/layouts/App.tsx`

```tsx
import React, { FC } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import LogIn from "@pages/Login";
import SignUp from "@pages/SignUp";

const App: FC = () => {
  return (
    <Switch>
      <Redirect exact path="/" to="/login" />
      <Route path="/login" component={LogIn} />
      <Route path="/signup" component={SignUp} />
    </Switch>
  );
};

export default App;
```

`front/client.tsx`

```tsx
import React from "react";
import { render } from "react-dom";

import App from "@layouts/App";
import { BrowserRouter } from "react-router-dom";

render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.querySelector("#app")
);
```

이후 데브서버를 실행시키면 `localhost:3090/login,` `localhost:3090/signup`페이지가 잘 나뉘어 노출되는 것을 확인할 수 있다.
이때 실제 리액트로 페이지를 구현하면 리액트는 single page application이므로 사실 하나의 주소(`localhost:3090`)만을 가지게 된다.
하지만 `webpack`의 `devServer` 설정 중 `historyApiFallback` 옵션을 true로 하면 해당 옵션이 브라우저의 History API를 활용해 실제 존재하지 않는 페이지를 있는 것처럼 구성해준다.

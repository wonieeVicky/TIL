# page와 레이아웃

## 1. pages 라우팅

첫번째 index페이지가 localhost:3000으로 잘 빌드됐다면 다른 파일도 만들어보자.

- /front/profile.js

```jsx
const Profile = () => {
  return <div>내 프로필</div>;
};

export default Profile;
```

- /front/signup.js

```jsx
const Signup = () => {
  return <div>회원가입 페이지</div>;
};

export default Signup;
```

위와 같이 설정 후 npm run dev로 next를 실행하면 `localhost:3000/profile`,`localhost:3000/signup` 으로 모두 라우팅 처리가 되어 노출된다.

만약 pages 내에 폴더링을 추가하면 어떻게 될까?

- /front/about/vicky.js

```jsx
const Vicky = () => {
  return <div>Hello, Vicky!</div>;
};

export default Vicky;
```

위와 같이 설정 시 `localhost:3000/about/vicky`에서 페이지를 확인할 수 있다.

## 2. 레이아웃

공통으로 사용하는 컴포넌트 등은 어디에 배치하면 좋을까? 바로 pages 내부가 아닌 별도의 폴더에 생성하면 된다. 폴더명은 자유롭게 결정해도 된다.

- /front/components/AppLayout.js

```jsx
import PropTypes from "prop-types";

const AppLayout = ({ children }) => {
  return (
    <div>
      <div>공통메뉴</div>
      {children}
    </div>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppLayout;
```

위와 같이 공통 메뉴에 대한 코드를 작성한 뒤 적용은 아래와 같이 한다.

- pages/index.js, profile.js signup.js

```jsx
import AppLayout from "../components/AppLayout";

const Home = () => {
  return (
		{/* AppLayout로 감싸준다 */}
    <AppLayout>
      <div>Hello, Next!</div>
    </AppLayout>
  );
};

export default Home;
```

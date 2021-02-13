# \_app.js와 Head

antd의 스타일을 사용하고 싶으면 해당 스타일 데이터를 공통 컴포넌트에 임포트해줘야 한다.
(Next 내에는 webpack이 기본적으로 설정되어있어, 해당 css를 스타일시트로 변환하여 html에 추가해준다)

해당 파일을 임포트할 공통 컴포넌트는 pages 폴더 내에 `_app.js`라는 이름으로 새로 생성하여, 공통으로 처리되어야 하는 파일을 추가 임포트해준다.

```jsx
// pages/_app.js
// 페이지에 공통 되는 것을 처리한다.
import PropTypes from "prop-types";
import "antd/dist/antd.css";

const NodeBird = ({ Component }) => {
  return <Component />;
};

NodeBird.propTypes = {
  Component: PropTypes.elementType.isRequired,
};

export default NodeBird;
```

위와 같이 설정하면 antd 디자인이 잘 적용되는 것을 확인할 수 있다. 이 밖에도 \_app.js 내에는 pages 들의 공통부분들을 넣어준다. (공통 메뉴 등) AppLayout 컴포넌트와 비슷한 개념이지만 조금 다른데, 차이는 일부 공통인지, 전체 공통인지에 대한 여부로 구별한다.

위와 같이 실행하면 Next는 렌더링을 통해 body 태그 안에 id="\_\_next" 를 root로 하여 데이터를 넣어준다. 그런데 만약 body가 아닌 head 태그를 조작해야할 때는 어떻게 해야할까? 그때엔 Next에서 제공해주는 Head 컴포넌트를 사용해서 데이터를 넣어준다.

```jsx
// 페이지에 공통되는 것을 처리한다.
import PropTypes from "prop-types";
import Head from "next/head";
import "antd/dist/antd.css";

const NodeBird = ({ Component }) => {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>NodeBird</title>
      </Head>
      <Component />
    </>
  );
};

NodeBird.propTypes = {
  Component: PropTypes.elementType.isRequired,
};

export default NodeBird;
```

위와 같이 meta tag와 타이틀 정보를 넣어줄 수 있다. 만약 특정 layout별로 head의 값을 달리줘야할 때에는 AppLayout 등의 컴포넌트에서 Head를 임포트하여 데이터를 넣어주면 된다.

```jsx
// signup.js
import AppLayout from "../components/AppLayout";
import Head from "next/head";

const Signup = () => {
  return (
    <>
      <Head>
        <title>회원가입 | NodeBird</title>
      </Head>
      <AppLayout>
        <div>회원가입 페이지</div>
      </AppLayout>
    </>
  );
};

export default Signup;
```

```jsx
import AppLayout from "../components/AppLayout";
import Head from "next/head";

const Profile = () => {
  return (
    <>
      <Head>
        <title>내 프로필 | NodeBird</title>
      </Head>
      <AppLayout>
        <div>내 프로필</div>
      </AppLayout>
    </>
  );
};

export default Profile;
```

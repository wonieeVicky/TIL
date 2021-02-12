## 1. Link

이제 만들어 둔 AppLayout 컴포넌트에 페이지별로 이동할 수 있는 Link를 추가해보자  
보통 React 사용 시 Link를 만들 때 React-Router를 많이 사용하는데, Next에서는 Next에서 제공하는 Link를 사용한다.

- /front/components/AppLayout.js

```jsx
import PropTypes from "prop-types";
import Link from "next/link";

const AppLayout = ({ children }) => {
  return (
    <div>
      <div>
        <Link href="/">
          <a>노드버드</a>
        </Link>
        &nbsp;
        <Link href="/profile">
          <a>프로필</a>
        </Link>
        &nbsp;
        <Link href="/signup">
          <a>회원가입</a>
        </Link>
      </div>
      {children}
    </div>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppLayout;
```

Link 태그를 사용하려면 연결 path는 Href 내에 적고 내부에 a 태그 생성 후 그 안에 텍스트를 작성해야 한다.

덧, development 환경에서 브라우저에 Link를 눌러 새로운 페이지를 확인하다보면 초기에 화면 로드 시 0.5초 정도 지연되는 현상이 발견된다. 이는 development에서의 이슈로 실제 Production에서는 해당 현상이 모두 개선되니 참조하자

## 2. eslint

프론트 화면 작업(개발) 시 코드 검사기로 eslint를 자주 사용하게 된다. eslint를 사용하면 여러 사람이 협업하여 코딩을 해도 한 사람이 코딩을 한 것처럼 코드 작성법을 맞출 수 있다. eslint에 필요한 패키지를 설치해보자

```bash
$ npm i eslint -D
$ npm i eslint-plugin-import -D
$ npm i eslint-plugin-react-hooks -D
```

패키지 설치를 마쳤다면 .eslintrc라는 파일을 만들어 해당 프로젝트의 eslint 설정을 추가한다.  
(파일 앞에 .이 붙어있으면 리눅스 환경에서 숨김파일이라는 의미이며, 해당 파일은 별도의 확장자가 없다.)

```json
{
  "parserOptions": {
    "ecmaVersion": 2020,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "env": {
    "browser": true,
    "node": true,
    "es6": true
  },
  "extends": ["eslint:recommmend", "plugin:react/recommended"],
  "plugins": ["import", "react-hooks"],
  "rules": {}
}
```

## 3. 그 외의 Q&A

### 3-1. SSR을 하려면 React와 node.js가 모두 필요하다.

반드시 nodeJS일 필요는 없다.  
단지, 서버 역할을 하는 spring, django, ruby on Rails, nodeJS 등이 필요하다.

### 3-2. material-ui, antd 차이점?

선호도와 상세 사용법의 차이이다. 부트 스트랩 등
디자인 시스템만 체계적으로 갖춰진 상태라면 굳이 UI 프레임워크를 사용할 필요는 없다.

### 3-3. next9 dynamic routing 기능

기존 Next에 다이나믹 라우팅 기능이 없을 때에는 커스텀 프론트엔드 서버를 만들었어야 했다.
그러나 Next9 버전부터 dynamic routing 기능이나 api routing 기능이 업데이트 되면서 별도의 서버 구성 필요없이 Next 안에서 모두 구현할 수 있게 되었다.

### 3-4. CORS 설정에 대하여

SSR이더라도 브라우저 - 백엔드 간 요청에 대한 CORS 설정이 필요하다.

### 3-5. code splitting 시 CSR, SSR의 흐름에 대하여

- 기존
  - 기존에는 브라우저 첫 유입 시 SSR로 처리
    (브라우저 -> 프론트 서버 -> 백엔드 서버 -> 프론트 서버 -> 브라우저)
  - 이후 브라우저 이동 시 CSR로 처리
    (브라우저 -> 백엔드 서버 -> 브라우저 -> ... )
- Code Splitting 시
  - code splitting으로 페이지별 코드가 분리되었을 경우
    CSR 처리 시에도 중간중간 프론트 서버와의 통신이 이루어진다.

### 3-6. 로딩을 없애는 역할로 SSR을 적용하는 것에 대하여

CSR 시 데이터를 받아오는 과정에서 로딩바가 길게 노출된다면 그만큼 지연이 느껴질 수 있다.
게다가 SSR을 활용해서 서버 호출 시 각 페이지나 데이터를 캐싱할 수 있기 때문에 더 빠른 데이터 교환이 가능하며 효율적이다.

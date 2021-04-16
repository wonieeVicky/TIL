# package.json

### npm이란

Node Package Manager

- 노드의 패키지 매니저
- 다른 사람들이 만든 소스 코드들을 모아둔 저장소
- 남의 코드를 사용하여 프로그래밍 가능
- 이미 있는 기능을 다시 구현할 필요가 없어 효율적
- 오픈 소스 생태계를 구성 중
- 패키지: npm에 업로드된 노드 모듈
- 모듈이 다른 모듈을 사용할 수 있듯 패키지도 다른 패키지를 사용할 수 있음
- 의존 관계라고 부름

### package.json

- 현재 프로젝트에 대한 정보와 사용 중인 패키지에 대한 정보를 담은 파일
  - 같은 패키지라도 버전별로 기능이 다를 수 있으므로 버전을 기록해두어야 함
  - 동일한 버전을 설치하지 않으면 문제가 생길 수 있음
  - 노드 프로젝트 시작 전 package.json부터 만들고 시작함(`npm init`)

### package.json 속성들

- package name
  - 패키지 이름, package.json의 name 속성에 저장된다.
- version
  - 패키지 버전, npm의 버전은 다소 엄격하게 관리된다. 5.3절에서 다룬다.
- entry point
  - 자바스크립트 실행 파일 진입점, 보통 마지막으로 module.exports를 하는 파일을 지정한다.
  - package.json의 main 속성에 저장된다.
- test command
  - 코드를 테스트할 때 입력할 명령어를 의미한다.
  - package.json scripts 속성 안의 test 속성에 저장된다.
- git repository
  - 코드를 저장해 둔 Git 저장소 주소를 의미한다.
  - 나중에 소스에 문제가 생겼을 때 사용자들이 이 저장소에 방문해 문제를 제기할 수도 있고, 코드 수정본을 올릴 수도 있다.
  - package.json의 repository 속성에 저장된다.
- keywords
  - 키워드는 npm 공식 홈페이지에서 패키지를 쉽게 찾을 수 있게 해준다.
  - package.json의 keywords 속성에 저장된다.
- license
  - 해당 패키지의 라이선스를 넣어주면 된다.

### npm 스크립트

- npm init이 완료되면 폴더에 package.json이 생성됨
- npm run [script name]으로 스크립트 실행
  - scripts에는 터미널에서 실행할 명령어를 별명으로 저장해둔 것을 의미한다.

### 패키지 설치하기

- express 설치하기

  ```bash
  $ npm i express body-parser
  $ npm i nodemon -D // 혹은 npm i --save-dev nodemon
  ```

- package.json에 기록됨(dependencies에 express 이름과 버전이 추가된다)

  ```json
  {
    // settings..
    "dependencies": {
      "body-parser": "^1.19.0",
      "express": "^4.17.1"
    },
    "devDependencies": {
      "nodemon": "^2.0.4"
    }
  }
  ```

# CLI 프로그램 만들기

### CLI

- CLI(Command LIne Interface) 기반 노드 프로그램 제작해보기
  - 콘솔 창을 통해서 프로그램을 수행하는 환경
  - 반대 개념으로는 GUI(그래픽 유저 인터페이스)가 있다.
  - 리눅스의 shell이나 브라우저 콘솔, 명령 프롬프트 등이 대표적인 CLI 방식 소프트웨어
  - 개발자에게는 CLI 툴이 더 효율적일 떄가 많다.

### 콘솔 명령어

- 노드 파일을 실행할 때 node [파일명] 명령어를 콘솔에 입력함
  - `node`나 `npm`, `nodemon`처럼 콘솔에서 입력하여 어떠한 동작을 수행하는 명령어를 콘솔 명령어라고 부른다.
  - `node`와 `npm` 명령어는 노드를 설치해야만 사용할 수 있다.
  - `nodemon`, `rimraf` 같은 명령어는 `npm i -g` 옵션으로 설치하면 명령어로 사용이 가능하다.
  - 패키지 명과 콘솔 명령어를 다르게 만들 수도 있다. (`sequelize-cli`는 `sequelize` 명령어를 사용)
  - 이러한 명령어를 만드는 것이 이번 챕터의 목표이다!

### 프로젝트 시작하기

- node-cli 폴더 안에 `package.json`과 `index.js` 생성
  - index.js 철 줄의 주석에 주목(윈도에서는 의미 없다)
    - index.js가 중요한 역할을 한다.
  - 리눅스나 맥 같은 유닉스 기반의 운영체제에서는 /usr/bin/env에 등록된 node 명령어로 이 파일을 실행하라는 의미이다.
- `pacakge.json`

  ```json
  {
    "name": "node-cli",
    "version": "1.0.0",
    "description": "nodejs cli program",
    "main": "index.js",
    "author": "Vicky",
    "license": "ISC"
  }
  ```

- `index.js`

  ```jsx
  #!/usr/bin/env node
  console.log("Hello CLI!");
  ```

### CLI 프로그램으로 만들기

- package.json에 다음 줄을 추가해준다.

  - bin 속성이 콘솔 명령어와 해당 명령어 호출 시 실행 파일을 설정하는 객체
  - 콘솔 명령어는 cli, 실행파일은 index.js

    ```json
    {
    	...
    	"license": "ISC",
    	"bin": {
    		"cli": "./index.js"
    	}
    }
    ```

### 콘솔 명령어 사용하기

- `npm i -g`로 설치 후 cli로 실행

  - 보통 전역 설치할 때는 패키지 명을 입력하지만 현재 패키지를 전역 설치할 때는 적지 않음

    ```bash
    $ npm i -g # 만약 에러가 난다면, npm i -g --force

    added 1 package, and audited 3 packages in 962ms
    found 0 vulnerabilities
    ```

  - 리눅스나 맥에서는 명령어 앞에 sudo를 붙여야할 수도 있다.
  - 전역 설치한 것이기 때문에 현재 패키지 폴더에 node_modules가 생기지 않는다.

    ```bash
    $ **cli**
    Hello CLI
    ```

    - cli 시 `#!/usr/bin/env : No such file or directory`라고 에러날 경우

      파일인코딩이 `UTF8 with BOM` 으로 설정되어있을 경우 #!에서부터 인식하지 못해 에러가 발생한다. shebang 코드가 UTF8 with BOM을 지원하지 않는 것 같다.. (~~3일동안 못풀어서 고생함..~~) 파일 인코딩을 UTF8로 고쳐서 실행하면 정상 실행된다 😇

    - cli 시 zsh: permission denied: cli 실행시

      `sudo cli`로 실행해준다.

    - cli 시 cli: command not found 시

      index.js에 쓰기 권한이 필요한 것이므로 `chmod +x ./index.js` 로 권한을 준다.

### 명령어에 옵션 붙이기

- process.argv로 명령어에 어떤 옵션이 주어졌는지 확인 가능

  `./index.js`

  ```jsx
  #!/usr/bin/env node
  console.log("Hello CLI", process.argv);
  ```

- 코드가 바뀔 때마다 전역 설치할 필요는 없다.
- `package.json` 내용이 바뀌면 다시 전역 설치해야 한다.
- 배열의 첫 요소는 노드의 경로, 두 번째 요소는 cli 명령어의 경로, 나머지는 옵션

  ```bash
  $ cli one two three
  Hello CLI [
    '/usr/local/bin/node',
    '/Users/uneedcomms/.npm-global/bin/cli',
    'one',
    'two',
    'three'
  ]
  ```

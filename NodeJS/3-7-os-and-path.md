# 7. os와 path

## 7-1. os

운영체제의 정보를 담고 있음

- 모듈은 require로 가져옴(내장 모듈이라 경로 대신 이름만 적어줘도 된다)
  - os.arch(): process.arch와 동일
  - os.platform(): process.platform과 동일
  - os.type(): 운영체제의 종류를 보여준다.
  - os.uptime(): 운영체제 부팅 이후 흐른 시간(초)을 보여준다. process.uptime()은 노드의 실행시간
  - os.hostname(): 컴퓨터의 이름을 보여준다.
  - os.release(): 운영체제의 버전을 보여준다.
  - os.homedir(): 홈 디렉터리 경로를 보여준다.
  - os.tmpdir(): 임시 파일 저장 경로를 보여준다.
  - os.cpus(): 컴퓨터의 코어 정보를 보여준다.
  - os.freemem(): 사용 가능한 메모리(RAM)을 보여준다.
  - os.totalmem(): 전체 메모리 용량을 보여준다.
- 더 자세한 사항은 [노드 공식문서](https://nodejs.org/dist/latest-v15.x/docs/api/os.html)에서 확인한다.

```jsx
const os = require("os");

console.log("운영체제 정보 ------------");
console.log("os.arch():", os.arch());
console.log("os.platform():", os.platform());
console.log("os.type():", os.type());
console.log("os.uptime():", os.uptime());
console.log("os.hostname():", os.hostname());
console.log("os.release():", os.release());
console.log("경로 ------------");
console.log("os.homedir():", os.homedir());
console.log("os.tmpdir():", os.tmpdir());
console.log("cpu 정보 ------------");
console.log("os.cpus():", os.cpus());
console.log("os.cpus().length:", os.cpus().length);
console.log("메모리 정보 ------------");
console.log("os.freemem():", os.freemem());
console.log("os.totalmem():", os.totalmem());
```

```bash
운영체제 정보 ------------
os.arch(): x64
os.platform(): darwin
os.type(): Darwin
os.uptime(): 74945
os.hostname(): yunideukeomjeuui-MacBook-Pro.local
os.release(): 20.3.0
경로 ------------
os.homedir(): /Users/uneedcomms
os.tmpdir(): /var/folders/zg/yl1l7kk5129cq2dxmfzjnfcm0000gn/T
cpu 정보 ------------
os.cpus(): [
  {
    model: 'Intel(R) Core(TM) i5-5287U CPU @ 2.90GHz',
    speed: 2900,
    times: { user: 3715470, nice: 0, sys: 1904510, idle: 16577900, irq: 0 }
  },
  {
    model: 'Intel(R) Core(TM) i5-5287U CPU @ 2.90GHz',
    speed: 2900,
    times: { user: 1320390, nice: 0, sys: 711360, idle: 20163580, irq: 0 }
  },
  {
    model: 'Intel(R) Core(TM) i5-5287U CPU @ 2.90GHz',
    speed: 2900,
    times: { user: 3580200, nice: 0, sys: 1641400, idle: 16973740, irq: 0 }
  },
  {
    model: 'Intel(R) Core(TM) i5-5287U CPU @ 2.90GHz',
    speed: 2900,
    times: { user: 1240870, nice: 0, sys: 660790, idle: 20293660, irq: 0 }
  }
]
os.cpus().length: 4
메모리 정보 ------------
os.freemem(): 1023025152
os.totalmem(): 17179869184
```

## 7-2. path

폴더와 파일의 경로를 쉽게 조작하도록 도와주는 모듈로 경로 처리할 때 많이 사용한다.

- 운영체제별로 경로 구분자가 다름(Windows: '\', POSIX(mac, linux): '/')
  - path.sep: 경로의 구분자. window는 \, POSIX는
  - path.delimiter: 환경 변수의 구분자. process.env.PATH를 입력하면 여러 개의 경로가 이 구분자로 되어있다. Windows는 세미콜론(;)이고 POSIX는 콜론(:) 이다.
  - path.dirname(경로): 파일이 위치한 폴더 경로를 보여준다.
  - path.extname(경로): 파일의 확장자를 보여준다.
  - path.basename(경로, 확장자): 파일의 이름(확장자 포함)을 보여준다. 파일의 이름만 표시하고 싶다면 basename의 두 번째 인자로 파일의 확장자를 넣어주면 된다.
  - path.parse(경로): 파일 경로를 root, dir, base, ext, name으로 분리
  - path.format(객체): path.parse()한 객체를 파일 경로로 합친다.
  - path.normalize(경로): /나 \를 실수로 여러 번 사용했거나 혼용했을 때 정상적인 경로로 변환해준다.
  - path.isAbsolute(경로): 파일의 경로가 절대 경로인지 상대경로인지 true나 false로 알려준다.
  - path.relative(기준경로, 비교경로): 경로를 두 개 넣으면 첫 번째 경로에서 두 번쨰 경로로 가는 방법을 알려준다.
  - path.join(경로, .. .): 여러 인자를 넣으면 하나의 경로로 합쳐준다. 상대 경로인 ..(부모 디렉토리)와 .(현 위치)도 알아서 처리해준다.
  - path.resolve(경로, .. .): path.join()과 비슷하지만 차이가 있다.

```jsx
const path = require("path");
const string = __filename;

console.log("path.join():", path.join(__dirname, "..", "var.js"));
console.log("path.resolve():", path.resolve(__dirname, "..", "/var.js")); // 절대경로가 있으면 앞 설정인자를 무시함
console.log("path.sep:", path.sep);
console.log("path.delimiter:", path.delimiter);
console.log("-------------------");
console.log("path.dirname(string):", path.dirname(string));
console.log("path.extname(string):", path.extname(string));
console.log("path.basename():", path.basename(string));
console.log(
  "path.basename(string, path.extname(string)):",
  path.basename(string, path.extname(string))
);
console.log("-------------------");
console.log("path.parse(string):", path.parse(string));
console.log("path.format():", path.format({ dir: "C://users//vicky", name: "path", ext: ".js" }));
console.log("path.normalize():", path.normalize("c://users////vicky////path.js"));
console.log("-------------------");
console.log("path.isAbsolute(c:\\):", path.isAbsolute("C://"));
console.log("path.isAbsolute(./home):", path.isAbsolute("./home"));
console.log("-------------------");
console.log("path.relative():", path.relative("C://users//vicky//path.js", "C://"));
console.log("-------------------");
```

```bash
path.join(): /Users/uneedcomms/study/TIL/NodeJS/var.js
path.resolve(): /var.js
path.sep: /
path.delimiter: :
-------------------
path.dirname(string): /Users/uneedcomms/study/TIL/NodeJS/lecture
path.extname(string): .js
path.basename(): test.js
path.basename(string, path.extname(string)): test
-------------------
path.parse(string): {
  root: '/',
  dir: '/Users/uneedcomms/study/TIL/NodeJS/lecture',
  base: 'test.js',
  ext: '.js',
  name: 'test'
}
path.format(): C://users//vicky/path.js
path.normalize(): c:/users/vicky/path.js
-------------------
path.isAbsolute(c:\): false
path.isAbsolute(./home): false
-------------------
path.relative(): ../../.. // 부모로 올라가는 방법을 알려줌
```

## 7-3. 알아둬야 할 path 관련 정보

- join과 resolve의 차이: resolve는 /를 절대 경로로 처리, join은 상대 경로로 처리

  - 상대 경로: 현재 파일 기준. 같은 경로면 점 하나(.), 한 단계 상위 경로면 점 두 개(..)
  - 절대 경로는 루트 폴더나 노드 프로세스가 실행되는 위치가 기준

  ```jsx
  path.join("/a", "/b", "c"); // /a/b/c/
  path.resolve("/a", "/b", "c"); // /b/c
  ```

- \\와 \ 차이: \는 window 경로 구분자, \\는 자바스크립트 문자열 안에서 사용(\가 특수문자라 \\로 이스케이프 해준 것)
- 윈도에서 POSIX path를 쓰고 싶다면: path.posix 객체 사용
  - POSIX에서 위도 path를 쓰고 싶다면: path.win32 객체 사용

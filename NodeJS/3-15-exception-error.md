# 15. 예외 처리

노드는 싱글스레드이므로 예외 처리가 매우 중요하다. (점원이나 주방장이 지치면 서비스가 멈춰버린다.)

## 15-1. 예외 처리

- 예외(Exception): 처리하지 못한 에러
  - 노드 스레드를 멈춤
  - 노드는 기본적으로 싱글 스레드라서 스레드가 멈춘다는 것은 프로세스가 멈추는 것이다.
  - 따라서 에러 처리는 필수이다!

## 15-2. try - catch 문

- 기본적으로 try - catch 문으로 예외를 처리한다.
  - 에러가 발생할 만한 곳을 try catch로 감쌈
- try - catch 문 예제
  - console.error로 에러메시지는 콘솔로 나오지만 시스템 상의 에러를 만들지는 않는다.

```jsx
setInterval(() => {
  console.log("시작");
  try {
    throw new Error("서버를 고장낸다");
  } catch (err) {
    console.error(err);
  }
}, 1000);
```

```bash
$ node test
시작
Error: 서버를 고장낸다
    at Timeout._onTimeout (/Users/uneedcomms/study/TIL/NodeJS/lecture/test.js:4:11)
    at listOnTimeout (node:internal/timers:556:17)
    at processTimers (node:internal/timers:499:7)
시작
Error: 서버를 고장낸다
    at Timeout._onTimeout (/Users/uneedcomms/study/TIL/NodeJS/lecture/test.js:4:11)
    at listOnTimeout (node:internal/timers:556:17)
    at processTimers (node:internal/timers:499:7)
```

## 15-3. 노드 비동기 메서드의 에러

- 노드 비동기 메서드의 에러는 **따로 처리하지 않아도 된다**.
  - 콜백 함수에서 에러 객체를 제공하며, 노드 비동기 메서드의 오류 발생시 프로세스를 멈추지 않는다.
- 노드 비동기 메서드 에러 예제

```jsx
const fs = require("fs");
setInterval(() => {
  fs.unlink("./abcdefg.js", (err) => {
    if (err) {
      console.error(err);
    }
  });
}, 1000);
```

```bash
$ node test
[Error: ENOENT: no such file or directory, unlink './abcdefg.js'] {
  errno: -2,
  code: 'ENOENT',
  syscall: 'unlink',
  path: './abcdefg.js'
}
[Error: ENOENT: no such file or directory, unlink './abcdefg.js'] {
  errno: -2,
  code: 'ENOENT',
  syscall: 'unlink',
  path: './abcdefg.js'
}
```

## 15-4. 프로미스 에러

- 프로미스 에러는 따로 처리하지 않아도 된다. 그러나 버전이 올라가면 동작이 바뀔 수 있다.
  - 에러가 아니라 워닝(경고)가 로깅되므로 경고는 무시해도 된다.
- 프로미스 에러 예제

```jsx
const fs = require("fs").promises;

setInterval(() => {
  fs.unlink("./asdsaf.js");
}, 1000);
```

```bash
$ node test
node:internal/process/promises:218
          triggerUncaughtException(err, true /* fromPromise */);
          ^

[Error: ENOENT: no such file or directory, unlink './asdsaf.js'] {
  errno: -2,
  code: 'ENOENT',
  syscall: 'unlink',
  path: './asdsaf.js'
}
```

## 15-5. Process 객체에 uncaughtException 이벤트를 넣어 처리

- 최후의 수단으로 사용
  - 콜백 함수의 동작이 보장되지 않음
  - 따라서 복구 작업용으로 쓰는 것은 부적합
  - 에러 내용 기록 용으로만 쓰는 게 좋음
    - 에러 내용을 전달받아 문제가 되는 부분을 빠르게 고치도록 한다!

```jsx
process.on("uncaughtException", (err) => {
  console.error("예기치 못한 에러", err);
});

setInterval(() => {
  throw new Error("서버를 고장낸다");
}, 1000);

setInterval(() => {
  console.log("실행된다");
}, 2000);
```

```bash
$ node test
예기치 못한 에러 Error: 서버를 고장낸다
    at Timeout._onTimeout (/Users/uneedcomms/study/TIL/NodeJS/lecture/test.js:6:9)
    at listOnTimeout (node:internal/timers:556:17)
    at processTimers (node:internal/timers:499:7)
실행된다
예기치 못한 에러 Error: 서버를 고장낸다
    at Timeout._onTimeout (/Users/uneedcomms/study/TIL/NodeJS/lecture/test.js:6:9)
    at listOnTimeout (node:internal/timers:556:17)
    at processTimers (node:internal/timers:499:7)
```

## 15-6. 프로세스 종료하기

- 윈도

  ```bash
  $ netstat -ano | findstr 포트
  $ taskkill /pid 프로세스아이디 /f
  ```

- 맥/리눅스

  ```bash
  $ lsof -i tcp:포트 // 내 노드서버가 사용하는 포트 번호 가져오기 (혹은 process.pid)
  $ kill -9 프로세스아이디
  ```

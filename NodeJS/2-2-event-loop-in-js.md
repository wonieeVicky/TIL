## 2) 이벤트 루프

```jsx
function run() {
  console.log("3초 후 실행");
}
console.log("시작");
setTimeout(run, 3000);
console.log("끝");
```

위 상황이 흘러가는 자바스크립트 흐름을 알아야 한다.

1. 호출 스택에 anonymous 추가
2. 메모리에 run 함수 추가
3. 호출 스택에 `console.log('시작');` 실행 후 삭제
4. 호출 스택에 `setTimeout(run, 3000);` 실행 후 삭제
5. 4와 동시에 백그라운드에 `setTimeout(run, 3초)` 등의 비동기 함수 추가 및 카운트
6. 호출 스택에 `console.log('끝');` 실행 후 삭제
7. 호출 스택에 anonymous 삭제
8. 백그라운드에 있던 setTimeout 3초 지난 후 태스크 큐에 동작코드 `run()` 추가
9. 호출 스택이 빈 상태가 되면 태스크 큐에 있던 `run()` 이동
10. 호출 스택에 run()하위의 `console.log('3초 후 실행');` 실행 후 삭제

```jsx
function oneMore() {
  console.log("one more");
}

function run() {
  console.log("run run");
  setTimeout(() => {
    console.log("wow");
  }, 0);
  new Promise((resolve) => {
    resolve("hi");
  }).then((response) => {
    console.log(response);
  });
  oneMore();
}

setTimeout(run, 5000);
```

- 위 코드의 순서 예측
- 이벤트루프 구조
  - 이벤트 루프: 이벤트 발생(setTimeout 등) 시 호출할 콜백 함수들이 호출할 순서를 결정하는 역할을 함
  - 태스크 큐: 이벤트 발생 후 호출되어야 할 콜백 함수들이 순서대로 기다리는 공간
  - 백그라운드: 타이머나 I/O 작업 콜백, 이벤트 리스너들이 대기하는 공간, 여러 작업이 동시에 수행될 수 있음 (백그라운드는 운영체제 쪽이며 javascript가 아닌 C++ 로 되어있으므로 멀티스레드로 동작 가능)

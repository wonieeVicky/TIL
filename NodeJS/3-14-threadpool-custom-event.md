# 14. 스레드풀, 커스텀 이벤트

## 14-1. 스레드풀 알아보기

- fs, crypto, zlib 모듈의 메서드를 실행할 때는 백그라운드에서 동시에 실행된다.
  - 스레드풀이 동시에 처리해준다.
- node는 기본적으로 백그라운드에서 돌아가는 fs, crypto, zlib 등을 한번에 4개씩 동시에 돌아갈 수 있도록 설정되어 있다.
- 물론 본인 컴퓨터의 코어에 맞추어 해당 갯수를 조정해줄 수도 있다. (UV_THREADPOOL_SIZE = 8)

```jsx
const crypto = require("crypto");

const pass = "pass";
const salt = "salt";
const start = Date.now();

crypto.pbkdf2(pass, salt, 1_000_000, 128, "sha512", () => {
  console.log("1:", Date.now() - start);
});

crypto.pbkdf2(pass, salt, 1000000, 128, "sha512", () => {
  console.log("2:", Date.now() - start);
});

crypto.pbkdf2(pass, salt, 1000000, 128, "sha512", () => {
  console.log("3:", Date.now() - start);
});

crypto.pbkdf2(pass, salt, 1000000, 128, "sha512", () => {
  console.log("4:", Date.now() - start);
});

crypto.pbkdf2(pass, salt, 1000000, 128, "sha512", () => {
  console.log("5:", Date.now() - start);
});

crypto.pbkdf2(pass, salt, 1000000, 128, "sha512", () => {
  console.log("6:", Date.now() - start);
});

crypto.pbkdf2(pass, salt, 1000000, 128, "sha512", () => {
  console.log("7:", Date.now() - start);
});

crypto.pbkdf2(pass, salt, 1000000, 128, "sha512", () => {
  console.log("8:", Date.now() - start);
});
```

```bash
$ node test
1: 3855
4: 3880
2: 3900
3: 3972
5: 7796
6: 7811
8: 7923
7: 7947

$ UV_THREADPOOL_SIZE=8 // 스레드풀 사이즈를 적절히 조절할 수 있다.
7 2743
6 2892
3 2895
1 2895
4 2895
8 2920
2 2940
5 2994
```

## 14-2. 이벤트 이해하기

커스텀 이벤트를 만들어줄 수 있다.

- 커스텀 이벤트 예제

```jsx
const EventEmitter = require("events");

const myEvent = new EventEmitter();
myEvent.addListener("event1", () => {
  console.log("이벤트 1");
});
myEvent.on("event2", () => {
  console.log("이벤트 2");
});
myEvent.on("event2", () => {
  console.log("이벤트 2 추가");
});
myEvent.once("event3", () => {
  console.log("이벤트 3");
}); // 한번만 실행된다.

myEvent.emit("event1"); // 이벤트 호출
myEvent.emit("event2"); // 이벤트 호출

myEvent.emit("event3"); // 이벤트 호출
myEvent.emit("event3"); // 실행 안 됨

myEvent.on("event4", () => {
  console.log("이벤트 4");
});
myEvent.removeAllListeners("event4");
myEvent.emit("event4"); // 실행 안 됨

const listener = () => {
  console.log("이벤트 5");
};
myEvent.on("event5", listener);
myEvent.removeListener("event5", listener); // 하나만 지울 경우 어떤 것을 지울지 명시해줘야 한다.
myEvent.emit("event5"); // 실행 안됨

console.log(myEvent.listenerCount("event2"));
```

```bash
$ node test
이벤트 1
이벤트 2
이벤트 2 추가
이벤트 3
2
```

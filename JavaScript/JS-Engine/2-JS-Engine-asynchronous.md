﻿## 인간 JS 엔진되기(비동기)

---

**[인간 JS 엔진되기](https://www.youtube.com/playlist?list=PLcqDmjxt30Rt9wmSlw1u6sBYr-aZmpNB3)**

- JS Core 기능을 직접 다뤄보면서, 놓쳤던 것들 다시 챙기기

---

### 프로미스의 좋은 점

자바스크립트의 비동기 개념이 들어오면 동작 과정을 이해하는 것이 어려워진다.
프로미스는 실행 후 결괏값을 나중에 쓸 수 있는 기능이다.

```jsx
function calculator(callback, a, b) {
  return callback(a, b);
}

calculator(
  function (x, y) {
    return x + y;
  },
  3,
  5
);
```

위 함수는 일반 동기 함수이다. callback 함수도 동기 함수이다. 인자가 전달되는 즉시 실행되기 때문임

```jsx
setTimeout(() => {
  console.log("a"); // () => { console.log('a'); } 이 부분은 콜백함수임
}, 1000);
```

반면 위 setTimeout 함수는 비동기 함수이다.

```jsx
const promise = new Promise((resolve) => {
  setTimeout(() => {
    console.log("a");
  }, 1000);
});

// another codes..
promise.then(() => {
  console.log("go");
});
```

프로미스의 가장 핵심 기능은 원하는 시점에 기능을 수행할 수 있다는 점이다.

만약 api 를 치는 로직이 다양하게 존재한다고 했을 때

```jsx
axios.get("서버주소1", function (data1) {
  axios.get("서버주소2", function (data2) {
    axios.get("서버주소3", function (data3) {
      //..
    });
  });
});
```

응답에 대한 처리 로직을 기존에는 위와 같이 구현한다고 한다면, 프로미스를 활용하면 아래와 같이 구현할 수 있다.

```jsx
const p1 = axios.get("서버주소1");
const p2 = axios.get("서버주소1");
const p3 = axios.get("서버주소1");
const p4 = axios.get("서버주소1");

Promise.all([p1, p2, p3, p4])
  .then((result) => {})
  .catch((err) => {});
Promise.allSettled([p1, p2, p3, p4])
  .then((result) => {})
  .catch((err) => {});
```

프로미스의 장점은 위와같이 처리하여 콜백지옥을 벗어날 수 있게 한다.
또한, catch문은 `Promise.all` 까지만이 아닌 `Promise.all().then()`까지 에러를 잡아낸다.

### 비동기는 동시가 아님. 순서의 문제이다.

비동기는 동시의 개념이 아니다. 동시에 2-3개가 돌아간다. 라는 개념으로 이해하기 보다는 순서로 이해하는 것이 옳다. 모든 코드는 위에서 아래로 흐르고 왼쪽에서 오른쪽으로 실행된다. 동기코드는 이 흐름을 그대로 따르며, 비동기 코드는 코드 순서와 실제 실행순서가 다르다는 점이 가장 핵심 포인트이다.

한번 비동기는 영원한 비동기 코드이다. 비동기 코드를 동기 코드로 바꿀 수 없다.

(비동기 함수인지 알 수 있는 방법은 문서를 보는 방법 밖에 없다. 비동기 함수 중 promise로 반환되는 지 등등은 문서로 확인한다.)

`async.js`

```jsx
setTimeout(() => {
  console.log("a");
}, 0);
setTimeout(() => {
  console.log("b");
}, 1000);
setTimeout(() => {
  console.log("c");
}, 2000);

// a
// b - 1초 뒤
// c - 2초 뒤
```

위와 같은 비동기 코드가 있다고 하자. 위 함수의 실행 콜스택은 아래와 같다.

anonymous → setTimeout(a) → setTimeout(b) → setTimeout(c)

그럼 실제 콘솔을 출력하는 콜백함수들은 어디에 작성할 수 있을까?
이는 이벤트 루프 영역에 그릴 수 있다.

```jsx
	 ┌───────────────────────────┐
┌─>│           timers          │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │
│  └─────────────┬─────────────┘      ┌───────────────┐
│  ┌─────────────┴─────────────┐      │   incoming:   │
│  │           poll            │<─────┤  connections, │
│  └─────────────┬─────────────┘      │   data, etc.  │
│  ┌─────────────┴─────────────┐      └───────────────┘
│  │           check           │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │
   └───────────────────────────┘
```

이벤트 루프는 실제 위와 같은 phase 단계를 거쳐서 실행된다.
위 과정을 간략하게 단계별로 담아놓는 이벤트 큐 영역으로 추상화해보면 아래와 같다.

T-fn(0) → T-fn(1000) → T-fn(2000) (T는 setTimeout의 줄임말)

위 이벤트 큐 영역에는 setTimeout, ajax, tick, eventListener, nextTick 등이 속할 수 있다. (동시성을 지원함)
위 이벤트 큐 영역이 실행되기 위해서는 콜 스택으로 옮겨져야 하며 해당 코드가 실행되도록 옮겨지기 위해서는 테스크 큐(매크로/마이크로 큐)에서 담겨 이벤트 루프에 의해 콜 스택으로 옮겨진다. (콜 스택이 비어져있을 때 하나씩 올려줌)

비동기는 순서의 문제이므로 위 과정을 하나씩 대입해 그릴 수 있다면 비동기 함수 또한, 동기 함수처럼 파악할 수 있게 된다.

### 한 번 비동기는 영원한 비동기 코드

이벤트 큐 영역에 들어가게 된 비동기 코드들이 Task Queue 즉, macro / micro 큐에 담겨 이벤트 루프에 의해 실행된다. 그렇다면 macro, micro 큐에는 어떤 코드들이 각각 담기게 될까?

micro Queue에는 promise, process.nextTick가 담기고, 나머지는 macro Queue에 속하게 된다.

이 둘이 나뉘는 이유는 코드가 거의 동시에 (완전 동시는 있을 수 없지만 아주 근소한 차이의 동시) 큐에 속하게 될 경우를 대비한 것으로 macro, micro Queue에 동시의 코드들이 담겨있을 경우 무조건 micro Queue가 먼저 실행된다.

즉, micro task queue가 꽉 차있는 상태라면 영원히 macro task queue는 실행되지 않는다.
코드로 간단히 이 예시를 확인할 수 있음

```
// 즉시 실행을 의미하는 setImmediate 함수 - macro queue에 담긴다.
setImmediate(() => {
  console.log("a");
});

// 바로 실행되는 promise 함수 - micro queue에 담긴다.
Promise.resolve().then(() => {
  console.log("p");
});

// p
// a
```

위 코드는 p, a로 반환됨. 즉, 거의 동시에 실행되는 함수에 있어서 micro queue → macro queue 가 우선되어 실행된다.

```jsx
let a = 2;

setTimeout(() => {
  a = 5;
  console.log("b");
}, 0);

console.log(a); // 2
setTimeout(() => {
  console.log(a); // 5
}, 0);
```

한번 동기는 영원한 비동기이기 때문에 바로 a값을 디버그 콘솔에 찍어보면 2가 담긴다.
단, 비동기 함수에 감싸 다시 a값을 확인해보면 5로 변경된 것을 확인할 수 있다.

### Promise에도 동기 부분이 있다.

이제, promise란 실행은 바로 하되, 결괏값을 나중에 원할 때 쓸 수 있는 것으로 이해하자

```jsx
let a = 2;
const p = new Promise((resolve, reject) => {
  console.log("제일 먼저");
  setTimeout(() => {
    a = 5;
    console.log(a);
    resolve(a);
  }, 0);
});

// 딴짓딴짓
console.log("딴짓");
// 딴짓딴짓
p.then((result) => {
  console.log("result:", result);
});

// 제일 먼저
// 딴짓
// 5
// result: 5
```

위와 같은 비동기 코드가 있다고 했을 대, 가장 먼저 `console.log`를 통해 값이 찍히는 부분은 바로 `제일 먼저`이다. 왜냐면 promise 내부의 콜백함수 영역은 동기 함수이기 때문이다. `(resolve, reject) => {…}`

비동기 코드는 코드의 흐름에 위치하지 않을 때만 비동기 함수로 파악하면 된다.
위 코드에서 이벤트 큐에는 setTimeout 함수 + p.then 함수가 들어가게 된다.
모든 동기 코드가 실행이 종료되면 macro queue에 존재하는 setTmeout 함수가 실행되고, 콜스택이 모두 비워지면 micro queue에 존재하는 p.then을 콜스택으로 가져와 실행시킨다.

이렇게 함수를 순서에 맞게 큐에 넣고, 이를 실행시키는 과정을 추상화해봄으로써 더욱 js 엔진과 친숙해질 수 있게 된다.

### async/await, Promise로 바꾸기

Promise.then., Promise.catch는 보통 아래와 같이 쓴다.

```jsx
p.then(() => {})
  .then(() => {})
  .then(() => {})
  .then(() => {})
  .catch(() => {})
  .finally(() => {});
```

아래와 같이 쓸 수 있음

```jsx
p.then(() => {})
  .then(() => {})
  .catch(() => {
    // 에러로 이동
  })
  .then(() => {})
  .catch(() => {
    // 에러로 이동
  })
  .then(() => {})
  .catch(() => {
    // 에러로 이동
  })
  .finally(() => {});
```

각 처리 코드에 따라 catch를 각각 붙혀서 에러에 따른 처리를 구체화할 수도 있다. (몰랐음..)
이 밖에도 async, await 함수도 그렇다.

```jsx
function delayp(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  });
}

async function a() {
  try {
    await delayp(1000); // 특수 비동기 함수에 대한 반환 처리 로직을 별도로 최적화
  } catch (err) {
    console.error(err);
  }

  try {
    await delayp(1000);
    await delayp(1000);
    await delayp(1000);
  } catch (err) {
    console.error(err);
  }
}
```

또한, then 안에서 리턴되는 문자는 다음 then의 result 값으로 담긴다.

```jsx
p.then((result) => {
  console.log("result:", result);
  return 1;
})
  .then((result) => {
    console.log(result); // 1이 반환
  })
  .then((result) => {
    console.log(result); // 별도 return이 없으면 undefined이 담긴다.
    return Promise.resolve(1);
  })
  .then((result) => {
    console.log(result); // 1이 반환
  })
  .then(() => {})
  .finally(() => {});
```

위와 같이 반환되는 구조 제대로 이해하고 있는지 확인
async ~ await 함수도 아래와 같은 trick을 이해하고 있는지 확인하자

```jsx
async function aa() {
  const a = await 1; // a = 1
  const b = await Promise.resolve(1); // b = 1
}

aa();
```

뿐만 아니라 async ~ await 함수를 promise로 바꿀 수도 잇어야 한다

```
async function aa() {
  const a = await 1; // a = 1
  console.log("a:", a); // 비동기 코드
  console.log("---"); // 비동기 코드
  await null;
  const b = await Promise.resolve(1); // b = 1
  console.log("b:", b);
  return b;
}

// 위 aa 함수를 promise 함수로 바꿔보자
Promise.resolve(1)
  .then((a) => {
    console.log("a:", a);
    console.log("---");
    return null;
  })
  .then(() => {
    return Promise.resolve(1);
  })
  .then((b) => {
    console.log("b:", b);
    return b;
  });
```

위 aa 함수는 아래 Promise 함수로 구현할 수 있게된다.
위와 같이 바꿀 수 있어야 비동기 async- await 코드에 대한 콜스택, 메시지 큐 등을 직접 머릿 속에 추상화하여 읽어내려갈 수 있게 된다.

또한 실제 aa 함수는 언제 종료될까?
`return b;`영역? 노노 바로 비동기 코드가 실행되는 `const a = await 1;`에서 종료된다.

```jsx
async function a() {
  console.log("2"); // 동기코드
  const a = await 1; // await then, 여기서부터 모두 비동기 코드(한번 비동기는 영원한 비동기)
  console.log("4");
  console.log("a", a);
  console.log("----");
  await null;
  const b = await Promise.resolve(1);
  console.log("b", b);
}

console.log("1");
a()
  .then((result) => {
    console.log("result:", result);
  })
  .then((result2) => {
    console.log("result2:", result2);
  });

console.log("3");

// 1
// 2
// 3
// 4
// a 1
// ----
// b 1
// result: undefined
// result2: undefined
```

위 비동기 함수에도 동기 로직이 섞여있다. 따라서 함수 실행 순서에 따라 콘솔로그가 어떻게 반환되어 오는지 잘 확인해보자

### 무지성 await 연달아 쓰지 말자

async 함수 사용 시 무지성으로 await을 많이 쓰게 되는데 그러지 않는 것이 좋다.

```jsx
function delayP(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  });
}

async function a() {
  await delayP(3000); // 3초
  console.log("1");
  await delayP(6000); // 6초
  console.log("2");
  await delayP(9000); // 9초
  console.log("3");
} // total 18s
```

위와 같은 `delayP` 비동기 함수가 있을 때, await을 무조건 앞에 붙이면 a 함수가 모두 실행되는데 총 18초가 걸리게 된다. 만약 첫번째와, 두번째가 동시에 실행될 수 있는 것이라면 위와 같이 처리하는 것이 비효율적일 것이다. 따라서 아래와 같이 처리할 수 있다.

```jsx
async function b() {
  const p1 = delayP(3000); // 3초
  const p2 = delayP(6000); // 6초
  await Promise.allSettled([p1, p2]); // 6ch
  await delayP(9000); // 9초
} // total 15s

// 결괏값을 가지고 바로 다음 로직을 실행하는 아래 구조만 활용하지 말고 위 구조도 익혀두자
axios
  .get()
  .then(() => {})
  .catch(() => {});
```

이러면 18초에서 15초로 함수 동작 시간을 줄일 수 있게된다. 즉 프로미스는 무조건 await을 붙이지말고 동시에 실행되도 되는 것은 우선 실행시켜 결괏값을 가진 상태로 유지하다가 필요한 상황에 다음 동작을 구현하는 것이 바람직하다.

만약 아래와 같이 게시글을 작성하는 함수가 있다고 하자

```jsx
async function createPost() {
  const post = await db.getPost(); // 게시물 조회
  if (post) {
    res.status(403).send("이미 게시글이 존재합니다.");
  } else {
    await db.createPost(); // 게시글 작성
    await db.userIncrementPostCount(); // 1. 사용자에 작성글 카운트 1 증가
    await db.createNoti(); // 2. 게시글 작성 완료 알림
  }
}
```

사실 게시글 작성 여부에 따라 1, 2는 각각 실행되어도 무방한 로직이다.
따라서 이를 await으로 굳이 단계를 나눌 필요가 없다. 이는 아래와 같이 처리할 수 있다.

```jsx
async function createPost() {
  const post = await db.getPost(); // 게시물 조회
  if (post) {
    res.status(403).send("이미 게시글이 존재합니다.");
  } else {
    await db.createPost(); // 게시글 작성

    // 아래처럼 개선
    const p1 = db.userIncrementPostCount();
    const p2 = db.createNoti();
    await Promise.allSettled([p1.p2]);
  }
}
```

이렇게 만들면 불필요한 단계 대기를 줄일 수 있게 된다.

### 프로미스의 다양한 활용

위에서 작업했던 b 함수를 프로미스를 활용해서 구현해보면 아래와 같다.

```jsx
async function b() {
  const p1 = delayP(3000); // 3초
  const p2 = delayP(6000); // 6초
  await Promise.allSettled([p1, p2]); // 6ch
  await delayP(9000); // 9초
} // total 15s

new Promise((resolve, reject) => {
  const p1 = delayP(3000); // 3초
  const p2 = delayP(6000); // 6초
	return Promise.all([p1, p2]); // 6초
}).then(() => {
  await delayP(9000); // 9초
});
```

위와 같이 구조를 잘 변경할 수 있도록 습득하자

```jsx
const results = await Promise.all([p1, p2, p3]);
results.map(async () => {
  // p1, p2, p3가 순차적으로 실행되지 않는다. 동시에 조작
  await result조작();
}, []);
```

위와 같이 p1, p2, p3가 실행되는 프로미스가 있다고 했을 때, map 안에 async로 돌리면 순차적으로 실행되지 않는다.
만약 순차적 실행이 중요하다면 아래와 같이 for문으로 해결할 수 있다.

```jsx
for (let result of results) {
  await result조작(); // p1 끝나고 p2 끝나고 p3, 순서대로 조작
}
```

### 클로저(closure) 분석

마지막으로 클로저에 대해 알아본다. 클로저는 스코프, 비동기, var 등이 복합적으로 섞여있는 문제이다.
클로저를 한 문장으로 정리하자면 함수와 함수 외부와의 관계를 뜻한다.
클로저로 발생한 문제는 클로저를 다른 방향으로 우회시킴으로서 문제를 해결할 수 있으며
아래와 같은 for 문(반복문) + 비동기 코드가 함께 사용될 경우 쉽게 발견할 수 있다.

```jsx
function a() {
  for (var i = 0; i < 5; i++) {
    setTimeout(() => {
      console.log(i);
    }, i * 1000);
  }
}

a();
// 5
// 5
// 5
// 5
// 5

// function a의 스코프는 1개고, for문의 스코프는 5개
```

위와 같은 함수가 있을 때, i에는 모두 5가 찍힌다. 이것이 var + for + 비동기가 섞인 문제이다.
위 문제의 이슈는 a 함수의 스코프는 이미 계산된 5로서 1개인데, for 문이 가진 스코프가 5개인 관계로 5가 연속하여 담기게 된다.

위 문제를 해결하기 위해서는 1. var 유지 + 즉시 실행함수로 클로저 생성하거나 2. var → let으로 변경하는 것으로 해결할 수 있다.

```jsx
// 1. var 유지 + 즉시 실행함수로 클로저 생성
function b() {
  for (var i = 0; i < 5; i++) {
    (function (j) {
      setTimeout(() => {
        console.log(j);
      }, i * 1000);
    })(i);
  }
}

b();
// 0
// 1
// 2
// 3
// 4

// 2. var > let으로 변경
function c() {
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      console.log(i);
    }, i * 1000);
  }
}
// a 스코프에서 i 0 -> 5 5개가 되어 for문의 스코프 5개에서 i는 각각 0,1,2,3,4

c();
// 0
// 1
// 2
// 3
// 4
```

위 과정을 앞서 배웠던 콜스택과 선언 맵, 이벤트 큐를 그려 순서대로 그리면 왜 console.log에 변수의 값이 저렇게 담기는지 이해할 수 있게된다. (이때 var는 블록 스코프가 아니고 함수 스코프를 기준으로 동작한다는 점 참고)
a 함수의 경우 i=4일 때까지 이벤트 큐가 동작하지않고 i=5가 되는 순간 false가 되어 이후 이벤트 큐에 담긴 setTimeout 가 동작하게 되는 구조이며 b함수의 경우에는 각 함수가 매번 선언과 동시에 바로 실행되므로 i의 값이 j가 계속 새롭게 담기도록 하여 순차적인 i 값이 담기게 된다. 이때 b의 즉시실행함수는 외부 함수 i와 클로저 관계를 가지며, 그 내부의 setTimeout에 담긴 콜백함수와 j 변수가 서로 클로저 관계를 갖는다.

클로저는 함수와 함수 외부와의 관계를 의미한다는 것. 잊지말자
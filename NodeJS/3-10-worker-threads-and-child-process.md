﻿# 10. worker_threads & child process

## 10-1. worker_threads

노드에서 멀티 스레드 방식으로 작업할 수 있다. (하지만 잘 사용하진 않는다.)

- isMainThread: 현재 코드가 메인 스레드에서 실행되는지, 워커 스레드에서 실행되는지 구분
- 메인 스레드에서는 new Worker를 통해 현재 파일(\_\_filename)을 워커 스레드에서 실행시킴
- worker.postMessage로 부모에서 워커로 데이터를 보냄
- parentPort.on('message')로 부모로부터 데이터를 받고, postMessage로 데이터를 보냄

```jsx
const { Worker, isMainThread, parentPort } = require("worker_threads");

if (isMainThread) {
  // 메인스레드
  const worker = new Worker(__filename);
  worker.on("message", (value) => console.log("워커로부터:", value));
  worker.on("exit", () => console.log("워커 끝!"));

  worker.postMessage("ping");
} else {
  // 워커스레드
  parentPort.on("message", (value) => {
    console.log("부모로부터:", value);
    parentPort.postMessage("pong");
    parentPort.close();
  });
}
```

```
부모로부터: ping
워커로부터: pong
워커 끝!
```

여러 개의 worker는 Set 자료형을 활용하여 중복되지 않은 배열에 담아 생성한ㄷ

```jsx
const { Worker, isMainThread, parentPort, workerData } = require("worker_threads");

if (isMainThread) {
  // 메인스레드: 워커스레드를 생성해준다.
  const threads = new Set();
  threads.add(
    new Worker(__filename, {
      workerData: { start: 1 },
    })
  );
  threads.add(
    new Worker(__filename, {
      workerData: { start: 2 },
    })
  );

  for (let worker of threads) {
    worker.on("message", (value) => console.log("워커로부터:", value));
    worker.on("exit", () => {
      threads.delete(worker);
      if (threads.size === 0) {
        console.log("워커 끝");
      }
    });
  }
} else {
  // 워커스레드
  const data = workerData;
  parentPort.postMessage(data.start + 100);
}
```

- 2부터 10_000_000까지 소수들 구하기

원래 기존의 싱글스레드 방식으로 해당 소수를 구하면 약 16초정도가 소요된다.

```jsx
const min = 2;
const max = 10_000_000;
const primes = [];

function generatePrimes(start, range) {
  let isPrime = true;
  const end = start + range;
  for (let i = start; i < end; i++) {
    for (let j = min; j < Math.sqrt(end); j++) {
      if (i !== j && i % j === 0) {
        isPrime = false;
        break;
      }
    }
    if (isPrime) {
      primes.push(i);
    }
    isPrime = true;
  }
}

console.time("prime");
generatePrimes(min, max);
console.timeEnd("prime");
console.log(primes.length);
```

```
prime: 16.617s
664579
```

이렇게 되면 16초 동안 컴퓨터는 해당 동작을 위해 그 어떤 동작도 하지 않고 멈춰있는 것이다. 따라서 이러한 문제를 멀티쓰레드 방식으로 구현하여 개선할 수 있다. **단, 번거로운 것은 워커생성 시 일을 직접 분배해줘야 하고, 워커가 일을 하게 하며, 워커가 끝낸 일을 합쳐주는 것, 완성된 후에 해야할 일을 직접 지정해주어야 한다.** 아래의 소수구하기 함수가 비교적 쉬운 워커생성 사례이다ㅎ

```jsx
const { Worker, isMainThread, parentPort, workerData } = require("worker_threads");

const min = 2;
let primes = [];

function findPrimes(start, range) {
  let isPrime = true;
  const end = start + range;
  for (let i = start; i < end; i++) {
    for (let j = min; j < Math.sqrt(end); j++) {
      if (i !== j && i % j === 0) {
        isPrime = false;
        break;
      }
    }
    if (isPrime) {
      primes.push(i);
    }
    isPrime = true;
  }
}

if (isMainThread) {
  const max = 10_000_000;
  const threadCount = 8;
  const threads = new Set();
  const range = Math.ceil((max - min) / threadCount);
  let start = min;
  console.time("prime");
  for (let i = 0; i < threadCount - 1; i++) {
    const wStart = start;
    threads.add(new Worker(__filename, { workerData: { start: wStart, range } }));
    start += range;
  }
  threads.add(
    new Worker(__filename, {
      workerData: { start, range: range + ((max - min + 1) % threadCount) },
    })
  );
  for (let worker of threads) {
    worker.on("error", (err) => {
      throw err;
    });
    worker.on("exit", () => {
      threads.delete(worker);
      if (threads.size === 0) {
        console.timeEnd("prime");
        console.log(primes.length);
      }
    });
    worker.on("message", (msg) => {
      primes = primes.concat(msg);
    });
  }
} else {
  findPrimes(workerData.start, workerData.range);
  parentPort.postMessage(primes);
}
```

```
prime: 7.925s
664579
```

싱글스레드보다 10초 앞당겨졌다! 기존에 16초인 것보다 약 6-7초 가량 앞당겨졌는데 8개의 워커를 두고 왜 이렇게 밖에 줄지 않았을까? 워커스레드를 많이 늘린다고 해서 시간이 비례해서 줄어들지는 않는다. 워커스레드를 만들고, 데이터를 보내는 과정에서도 시간이 걸리기 때문이다. 또한 컴퓨터 사양에 따라 코어가 적을 경우 순차적으로 실행되므로 실행환경에 따라 가장 최선의 방법을 선택하는 것이 좋다.

## 10-2. child_process

노드에서 여러 개의 멀티쓰레드를 운영하는 것이 코드가 복잡하므로 노드 안에서 다른 언어를 활용하여 구현하는 방법도 있다. 노드는 다른 언어에게 '이것 좀 실행해줘'라고 요청만 할 수 있다. 노드 안에서 파이썬 코드를 싱행시켜보자

```jsx
// test.js
const spawn = require("child_process").spawn;
var process = spawn("python", ["test.py"]);

process.stdout.on("data", function (data) {
  console.log(data.toString());
});

process.stderr.on("data", function (data) {
  console.error(data.toString());
});
```

```python
// test.py
print('hello python')
```

위와 같이 설정 후 노드를 실행시켜보면 정상적으로 `hello python`이 실행된 후 해당 정보가 노드 스크립트 안에 잘 반환되고 있다. 파이썬이나 C 등으로 멀티스레드를 구현하는 것이 비교적 더 효율적이므로 해당 방법을 사용해서 구현해보면 좋다.

## 10-3. 기타 노드 내장 모듈들

- assert: 값을 비교하여 프로그램이 제대로 동작하는지 테스트하는 데 사용
- dns: 도메인 이름에 대한 IP 주소를 얻어내는 데 사용
- net: HTTP보다 로우 레벨인 TCP나 IPC 통신을 할 떄 사용
- string_decoder: 버퍼 데이터를 문자열로 바꾸는 데 사용
- tls: TLS와 SSL에 관련된 작업을 할 떄 사용
- tty: 터미널과 관련된 작업을 할 떄 사용
- dgram: UDP와 관련된 작업을 할 때 사용
- v8: v8 엔진에 직접 접근할 떄 사용
- vm: 가상 머신에 직접 접근할 떄 사용

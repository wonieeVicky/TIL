# 6.process

## 6-1. process

현재 실행중인 노드 프로세스에 대한 정보를 담고있다.

- node 실행 후 process만 쳐도 무수히 많은 정보들이 나옴
- 컴퓨터마다 출력값이 다를 수 있음

```bash
$ node
> process.version
'v15.2.0' // 설치된 노드 버전
> process.arch
'x64' // 프로세서 아키텍처 정보, arm, ia32 등의 값일 수도 있다.
> process.platform
'darwin' // 운영체제 플랫폼 정보, linux나 darwin, freebsd 등의 값일 수도 있다.
> process.pid
2160 // 현재 프로세스 아이디, 프로세스를 여러 개 가질 때 구분할 수 있다.
> process.uptime()
35.798789158 // 프로세스가 시작된 후 흐른 시간, 단위는 초
> process.execPath
'/usr/local/Cellar/node/15.2.0/bin/node' // 노드의 경로
> process.cwd()
'/Users/uneedcomms/study/TIL/NodeJS/lecture' // 현재 프로세스가 실행되는 위치
> process.cpuUsage()
{ user: 487139, system: 82047 } // 현재 cpu 사용량
```

## 6-2. process.env

시스템 환경 변수들이 들어있는 객체

- 비밀키(데이터베이스 비밀번호, 서드파티 앱 키 등)를 보관하는 용도로 쓰임
- 환경변수는 process.env로 접근 가능

```jsx
const secretId = process.env.SECRET_ID;
const secretCode = process.env.SECRET_CODE;
```

- 일부 환경 변수는 노드 실행 시 영향을 미친다.
- 예시) NODE_OPTIONS(노드 실행 옵션), UV_THREADPOOOL_SIZE(스레드풀 개수)
  - max-old-space-size는 노드가 사용할 수 있는 메모리를 지정하는 옵션

```jsx
NODE_OPTIONS = --max - old - space - size = 8192; // 노드가 사용할 수 있는 메모리를 조절할 수 있다.
UV_THREADPOOL_SIZE = 8; // 노드를 8개까지 동시에 돌리도록 한다(기본 4개)
```

## 6-3. process.nextTick(콜백)

이벤트 루프가 다른 콜백 함수들보다 nextTick의 콜백 함수를 우선적으로 처리한다. microTask..

- 너무 남용하면 다른 콜백 함수들 실행이 늦어진다.
- 비슷한 경우로 promise가 있음(nextTick처럼 우선순위가 높음)
- 아래 예제에서 setImmediate, setTimeout보다 promise와 nextTick이 먼저 실행된다.

```jsx
setImmediate(() => {
  console.log("immediate");
});
process.nextTick(() => {
  console.log("nextTick");
});
setTimeout(() => {
  console.log("Timeout");
}, 0);
Promise.resolve().then(() => console.log("promise"));
```

```bash
$ node test
nextTick
promise
Timeout
immerdiate
```

## 6-4. process.exit(코드)

현재의 프로세스를 멈춘다.

- 코드가 없거나 0이면 정상 종료:
  - process.exit(1): 서버에서 에러가 있을 경우 1을 넣어 사용한다.
- 이외의 코드는 비정상 종료를 의미함

```bash
let i = 1;
setInterval(() => {
  if (i === 5) {
    console.log("종료");
    process.exit();
  }
  console.log(i);
  i++;
}, 1000);
```

```bash
$ node test
1
2
3
4
종료
```

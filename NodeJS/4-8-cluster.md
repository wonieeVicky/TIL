# cluster

기본적으로 싱글 스레드인 노드가 CPU 코어를 모두 사용할 수 있게 해주는 모듈이다.

- 포트를 공유하는 노드 프로세스를 여러 개 둘 수 있다.
- 요청이 많이 들어왔을 때 병렬로 실행된 서버의 개수만큼 요청이 분산된다.
- 서버에 무리가 덜 감
- 코어가 8개인 서버가 있을 때 cluster로 코어 하나당 노드 프로세스 하나를 배정 가능
  - 보통은 코어 하나만 활용
- 성능이 8배가 되는 것은 아니지만 개선됨
- 단점: 컴퓨터 자원(메모리, 세션 등) 공유 못 함
  - 로그인 등에서 이슈가 발생 ⇒ Redis 등 별도 서버로 해결

### 서버 클러스터링

마스터 프로세스와 워커 프로세스

- 마스터 프로세스는 CPU 개수만큼 워커 프로세스를 만든다 (worker_threads랑 구조가 비슷함)
  - worker_threads는 스레드를 여러 개 만들고, 클러스터는 프로세스를 여러 개 만든다.
- 요청이 들어오면 워커 프로세스에 고르개 분배한다. (round-robin? 이라는 알고리즘에 의해)

`cluster.js`

```tsx
const cluster = require("cluster");
const http = require("http");
const numCPUs = require("os").cpus().length; // cpu 개수 가져옴

if (cluster.isMaster) {
  console.log(`마스터 프로세스 아이디: ${process.pid}`);
  // CPU 개수만큼 워커를 생산
  for (let i = 0; i < numCPUs; i += 1) {
    cluster.fork(); // 워크 프로세스가 종료되면 다시 켜준다.
  }
  // 워커가 종료되었을 때
  cluster.on("exit", (worker, code, signal) => {
    console.log(`${worker.process.pid}번 워커가 종료되었습니다.`);
    console.log("code", code, "signal", signal);
    cluster.fork(); // 워크 프로세스가 종료되면 다시 켜준다.
  });
} else {
  // 워커들이 포트에서 대기
  http
    .createServer((req, res) => {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.write("<h1>Hello Node!</h1>");
      res.end("<p>Hello Cluster!</p>");
      setTimeout(() => {
        // 워커 존재를 확인하기 위해 1초마다 강제 종료
        process.exit(1);
      }, 1000);
    })
    .listen(8086); // n개의 서버를 하나의 포트에 담을 수 있다. 요청 분배 가능

  console.log(`${process.pid}번 워커 실행`);
}
```

```bash
node cluster
마스터 프로세스 아이디: 52173
52175번 워커 실행
52174번 워커 실행
52176번 워커 실행
52177번 워커 실행
52174번 워커가 종료되었습니다.
code 1 signal null
52185번 워커 실행
52175번 워커가 종료되었습니다.
code 1 signal null
52186번 워커 실행
52176번 워커가 종료되었습니다.
code 1 signal null
52187번 워커 실행
52177번 워커가 종료되었습니다.
code 1 signal null
52188번 워커 실행
52185번 워커가 종료되었습니다.
code 1 signal null
52189번 워커 실행
52186번 워커가 종료되었습니다.
code 1 signal null
52190번 워커 실행
52187번 워커가 종료되었습니다.
code 1 signal null
52191번 워커 실행
```

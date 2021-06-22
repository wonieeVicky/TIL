# 부하 테스트

### 부하 테스트란?

- 서버가 얼마만큼의 요청을 견딜 수 있는지 테스트한다.
  - 서버가 몇 명의 동시 접속자를 수용할 수 있는지 예측하기 매우 어렵다.
  - 실제 서비스 중이 아니라 개발 중일 때는 더 어렵다.
  - 코드에 문제가 없더라도 서버 하드웨어 때문에 서비스가 중단될 수 있다.
  - 부하 테스트를 통해 미리 예측할 수 있다.

### 부하 테스트를 위한 artillery 설치

```bash
$ npm i -D artillery
```

터미널에 8001번 서버를 띄워놓은 상태로 터미널을 하나 더 띄워서 테스트를 한다.

```bash
$ npm start
...
데이터베이스 연결 성공
```

```bash
$ npx artillery quick --count 100 -n 50 http://localhost:8001
Started phase 0, duration: 2s @ 22:57:23(+0900) 2021-06-22
...
All virtual users finished
Summary report @ 22:58:09(+0900) 2021-06-22
  Scenarios launched:  100
  Scenarios completed: 100
  Requests completed:  5000
  Mean response/sec: 107.94
  Response time (msec):
    min: 129
    max: 1633
    median: 851
    p95: 1297.5 // 하위 5% - median과 많이 차이나면 의심해본다.
    p99: 1522 // 하위 1% - median과 많이 차이나면 의심해본다.
  Scenario counts:
    0: 100 (100%)
  Codes:
    200: 5000
```

### 여러 페이지 요청 시나리오(실행)로 부하테스트 하기

각 페이지별로 이동하는 시나리오를 세워서 부하테스트를 할 수도 있다.

`nodebird-test/loadtest.json`

- 자세한 작성사항은 artillery DOCS를 확인한다.
- 60초 동안 1초에 30명의 유저가 접근하는 부하를 테스트한다.

```json
{
  "config": {
    "target": "http://localhost:8001",
    "phases": [
      {
        "duration": 60,
        "arrivalRate": 30
      }
    ]
  },
  "scenarios": [
    {
      "flow": [
        {
          "get": {
            "url": "/"
          }
        },
        {
          "post": {
            "url": "/auth/login",
            "json": {
              "email": "fongfing@gmail.com",
              "password": "1234"
            }
          }
        },
        {
          "post": {
            "url": "/hashtag?hastag=nodebird"
          }
        }
      ]
    }
  ]
}
```

- 문제점 발견

  ```bash
  $ npx artillery run loadtest.json

  All virtual users finished
  Summary report @ 23:19:34(+0900) 2021-06-22
    Scenarios launched:  600
    Scenarios completed: 540
    Requests completed:  2748
    Mean response/sec: 36.24
    Response time (msec):
      min: 0
      max: 9999
      median: 23
      p95: 8683.9
      p99: 9780.2
    Scenario counts:
      0: 600 (100%)
    Codes:
      200: 588
      302: 540
      404: 1620
    Errors:
      ETIMEDOUT: 60
  ```

  - 요청 후반부가 될수록 응답시간이 길어짐
  - 첫 응답은 0초, 마지막 응답은 99초
  - 588개 요청은 200응답, 540개는 302, 1620개는 404
  - 서버가 지금 정도의 요청을 감당하지 못한다.
  - 서버 사양을 업그레이드하거나, 여러 개 두거나 처리해야 한다.
  - 현재는 싱글코어만 사용하므로 클러스터링 기법 도입을 시도해볼만 하다.
  - arrivalRate를 줄이거나 늘려서 어느 정도 수용이 가능한지 체크해보는 것이 좋다.
  - 여러 번 테스트하여 평균치를 보도록 하자

### 테스트 범위

- 어떤 것을 테스트하고 어떤 것을 테스트 안 할지 고민

  - 자신이 짠 코드는 최대한 많이 테스트하기
  - npm을 통해 설치한 패키지는 테스트하지 않는다.(패키지 만든 사람의 몫임)
  - 패키지/라이브러리 사용하는 부분만 테스트
  - 테스트하기 어려운 패키지는 모킹
  - mocking해서 통과하더라도 실제 상황에서는 에러날 수 있음을 염두에 두자

  ***

  - 시스템 테스트: QA처럼 테스트 목록을 두고 체크해나가면서 진행하는 테스트
  - 인수 테스트: 알파 테스트/ 베타 테스트처럼 특정 사용자 집단이 실제로 테스트
  - 다양한 종류의 테스트를 주기적으로 수행해 서비스를 안정적으로 유지하는 게 좋음

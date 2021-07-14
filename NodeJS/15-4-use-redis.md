# redis 사용하기

### connect-redis

- 멀티 프로세스간 메모리 공유를 위해 redis 사용

  - connect-redis가 익스프레스와 레디스를 연결해준다.

    ```bash
    $ npm i redis connect-redis redis
    ```

  - redislabs 웹사이트 접속, LOGIN 버튼 클릭
    - Get Started Free 클릭하여 회원가입
    - 인증 이메일에서 Activate Now 클릭
    - setting account에서 Cloud 버튼 선택, 개인 정보 입력 후 Continue

### Subscription 설정하기

- Free 요금제 선택 후 Subscription Name을 node-deploy로 설정

  - Select Cloud Provider : aws
  - Select Region : us-east-1
  - Fixed size : 30MB Free

    ![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/3901ed04-3a14-4a5b-b4c6-d520e97d8948/_2021-07-14__11.05.49.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/3901ed04-3a14-4a5b-b4c6-d520e97d8948/_2021-07-14__11.05.49.png)

### 레디스 데이터베이스 설정

- 데이터베이스 이름을 node-deploy로 생성하고 Active 버튼을 누른다.

  ![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/58d4cb8b-bbfb-4c9b-9e88-d39cb0a401ce/_2021-07-14__11.07.35.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/58d4cb8b-bbfb-4c9b-9e88-d39cb0a401ce/_2021-07-14__11.07.35.png)

### 레디스 호스팅 생성 완료

- Endpoint와 Redis password를 복사해 .env에 붙여넣기

  - endpoint에서 host와 port를 분리

    ![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/acb61825-bccf-42ea-89f9-80181ba810f8/_2021-07-14__11.10.23.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/acb61825-bccf-42ea-89f9-80181ba810f8/_2021-07-14__11.10.23.png)

  - `.env`

    ```
    REDIS_HOST=redis-16123.c267.us-east-1-4.ec2.cloud.redislabs.com
    REDIS_PORT=12345
    REDIS_PASSWORD=Bm4iTeYQWyzxRG0vTLIF5LxqPmPfgk9B
    ```

### connect-redis 연결하기

- `app.js` 내 express-session sessionOption 부분에 store 속성 추가

  - RedisStore 생성자의 인스턴스를 store 속성에 등록
  - 서버를 껏다 켜도 로그인이 유지된다.
  - express-rate-limit

    10장에서 사용하는 `express-rate-limit` 패키지도 사용량을 메모리에 기록하므로 서버를 재시작하면 사용량이 초기화된다. 따라서 이것도 레디스에 기록하는 것이 좋다. `rate-limit-redis`라는 패키지와 `express-rate-limit` 패키지를 같이 사용하면 된다.

### nvm, n

- 노드 버전을 업데이트하기 위한 패키지

  - 윈도에서는 nvm-installer, 리눅스나 맥에서는 n 패키지

    - nvm-installer

      - [사이트](https://github.com/coreybutler/nvm-windows/releases)에서 nvm-setup.zip 내려받아 압축 해제 후 실행
      - nvm list로 노드 버전 확인, nvm install로 버전 설치 (nvm install lastest로 최신 버전 설치)

        ```bash
        $ nvm list
        * 14.0.0 (Currently using 64-bit executable)
        ```

        ```bash
        $ nvm install 14.1.0
        ```

      - `nvm use [version]`으로 사용하고 싶은 버전 입력

        ```bash
        $ nvm use 14.1.0
        Now using node v14.1.0 (64-bit)

        $ node -v
        v14.1.0
        ```

    - n을 전역 설치

      - sudo npm i -g n
      - n 명령어로 현재 노드 버전 확인
      - n 버전으로 새 버전 설치

        ```bash
        $ n
        node/14.0.0

        $ n 14.1.0
        installed v14.1.0
        $ node -v
        v14.17.3
        ```

# Next.js 실행해보기

1.  prepare/front 폴더에서 npm init 후 next.js 패키지 install

    ```bash
    $ npm init
    $ npm i next@9
    $ npm i react react-dom
    ```

2.  그 다음 package.json 내 script 설정을 아래와 같이 바꾼다.

    ```json
    {
      "name": "react-nodebird-front",
      "version": "1.0.0",
      "description": "",
      "main": "index.js",
      "scripts": {
        "dev": "next"
      },
      "author": "Vicky",
      "license": "MIT",
      "dependencies": {
        "next": "^9.5.5",
        "react": "^17.0.1",
        "react-dom": "^17.0.1"
      }
    }
    ```

3.  front 폴더 하위에 pages 폴더를 만든 뒤 index.js 에 아래의 코드를 기입해본다.

    - next.js로 실행될 경우 상단 import React from "react"; 가 없어도 된다. 🥰
    - 페이지로 분류될 것들은 반드시 pages 폴더 하위에 배치해야 한다.
      next.js는 pages 폴더를 기준으로 code splitting된 컴포넌트로 만들어주기 때문!

    ```jsx
    const Home = () => {
      return <div>Hello, Next!</div>;
    };

    export default Home;
    ```

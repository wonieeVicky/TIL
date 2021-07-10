# readline 사용하기

### 사용자로부터 입력 받기

- 노드 내장 모듈인 readline을 사용

  `./index.js`

  ```jsx
  #!/usr/bin/env node

  const readline = require("readline");

  const rl = readline.createInterface({
    input: process.stdin, // 콘솔에 입력
    output: process.stdout, // 콘솔에 출력
  });

  const answerCallback = (answer) => {
    if (answer === "y") {
      console.log("감사");
      rl.close(); // 끝내기
    } else if (answer === "n") {
      console.log("죄송");
      rl.close(); // 끝내기
    } else {
      console.log("y나 n만 입력하세요.");
      rl.question("예제가 재미있습니까? (y/n)\n", answerCallback);
    }
  };

  rl.question("예제가 재미있습니까? (y/n)\n", answerCallback);
  ```

  ```bash
  $ cli
  예제가 재미있습니까? (y/n)
  yes
  y나 n만 입력하세요.
  예제가 재미있습니까? (y/n)
  n
  ```

### 콘솔 내용 지우기

- console.clear로 콘솔 내용 지우기

  - shell에 따라 콘솔 내용이 실제로 지워지기도 하고, 스크롤 시 기존 내역이 남아있기도 하고 다르다!

  ```jsx
  #!/usr/bin/env node

  // ...

  console.clear(); // 콘솔 지우고 시작

  // ...
  rl.question("예제가 재미있습니까? (y/n)\n", answerCallback);
  ```

### template.js로 탬플릿 생성 cli 구현하기

- `template.js` 작성

  ```jsx
  #!/usr/bin/env node
  const fs = require("fs");
  const path = require("path");
  const readline = require("readline");

  let rl;
  let type = process.argv[2];
  let name = process.argv[3];
  let directory = process.argv[4] || ".";

  const htmlTemplate = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>Template</title>
    </head>
    <body>
      <h1>Hello</h1>
      <p>CLI</p>
    </body>
  </html>
  `;

  const routerTemplate = `
  const express = require('express');
  const router = express.Router();
   
  router.get('/', (req, res, next) => {
     try {
       res.send('ok');
     } catch (error) {
       console.error(error);
       next(error);
     }
  });
   
  module.exports = router;
  `;

  const exist = (dir) => {
    // 폴더 존제 확인 함수
    try {
      fs.accessSync(dir, fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK);
      return true;
    } catch (e) {
      return false;
    }
  };

  const mkdirp = (dir) => {
    // 경로 생성 함수
    const dirname = path
      .relative(".", path.normalize(dir))
      .split(path.sep)
      .filter((p) => !!p);
    dirname.forEach((d, idx) => {
      const pathBuilder = dirname.slice(0, idx + 1).join(path.sep);
      if (!exist(pathBuilder)) {
        fs.mkdirSync(pathBuilder);
      }
    });
  };

  const makeTemplate = () => {
    // 템플릿 생성 함수
    mkdirp(directory);
    if (type === "html") {
      const pathToFile = path.join(directory, `${name}.html`);
      if (exist(pathToFile)) {
        console.error("이미 해당 파일이 존재합니다");
      } else {
        fs.writeFileSync(pathToFile, htmlTemplate);
        console.log(pathToFile, "생성 완료");
      }
    } else if (type === "express-router") {
      const pathToFile = path.join(directory, `${name}.js`);
      if (exist(pathToFile)) {
        console.error("이미 해당 파일이 존재합니다");
      } else {
        fs.writeFileSync(pathToFile, routerTemplate);
        console.log(pathToFile, "생성 완료");
      }
    } else {
      console.error("html 또는 express-router 둘 중 하나를 입력하세요.");
    }
  };

  const dirAnswer = (answer) => {
    // 경로 설정
    directory = (answer && answer.trim()) || ".";
    rl.close();
    makeTemplate();
  };

  const nameAnswer = (answer) => {
    // 파일명 설정
    if (!answer || !answer.trim()) {
      console.clear();
      console.log("name을 반드시 입력하셔야 합니다.");
      return rl.question("파일명을 설정하세요. ", nameAnswer);
    }
    name = answer;
    return rl.question("저장할 경로를 설정하세요.(설정하지 않으면 현재경로) ", dirAnswer);
  };

  const typeAnswer = (answer) => {
    // 템플릿 종류 설정
    if (answer !== "html" && answer !== "express-router") {
      console.clear();
      console.log("html 또는 express-router만 지원합니다.");
      return rl.question("어떤 템플릿이 필요하십니까? ", typeAnswer);
    }
    type = answer;
    return rl.question("파일명을 설정하세요. ", nameAnswer);
  };

  const program = () => {
    if (!type || !name) {
      rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
      console.clear();
      rl.question("어떤 템플릿이 필요하십니까? ", typeAnswer);
    } else {
      makeTemplate();
    }
  };

  program(); // 프로그램 실행부
  ```

### 템플릿 CLI 프로그램 실행하기

```bash
$ cli
어떤 템플릿이 필요하십니까? html
파일명을 설정하세요. test
저장할 경로를 설정하세요.(설정하지 않으면 현재경로) public/vicky
public/vicky/test.html 생성 완료
```

`public/vicky/test.html`

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Template</title>
  </head>
  <body>
    <h1>Hello</h1>
    <p>CLI</p>
  </body>
</html>
```

혹은

```bash
$ cli
어떤 템플릿이 필요하십니까? express-router
파일명을 설정하세요. router
저장할 경로를 설정하세요.(설정하지 않으면 현재경로) public/router
public/router/router.js 생성 완료
uneedcomms@yunideukeomjeuui-MacBo
```

`public/router/router.js`

```jsx
const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  try {
    res.send("ok");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
```

혹은

```bash
$ cli html new ./public
public/new.html 생성 완료
```

### 전역에 설치된 패키지 삭제

- 간혹 `npm i -g`로 변경사항을 업데이트해도 반영되지 않을 경우 모두 삭제 후 재 설치해준다.

  ```jsx
  node-cli % npm rm -g
  removed 1 package, and audited 1 package in 278ms

  found 0 vulnerabilities
  % cli
  zsh: command not found: cli
  ```

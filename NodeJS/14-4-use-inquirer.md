# inquirer 사용하기

### inquirer 사용하기

- 여전히 옵션을 외워야 하는 불편함을 inquirer로 상호 작용을 추가해준다.

```jsx
#!/usr/bin/env node
const { program } = require("commander");
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const inquirer = require("inquirer");
const { version } = require("./package.json");

// 그냥 cli만 쳤거나 틀린 명령어를 입력했을 때
program.action((cmd, args) => {
  if (args.args.length) {
    console.log(chalk.bold.red("해당 명령어를 찾을 수 없습니다."));
    program.help();
  } else {
    inquirer
      .prompt([
        {
          type: "list",
          name: "type",
          message: "템플릿 종류를 선택하세요.",
          choices: ["html", "express-router"],
        },
        {
          type: "input",
          name: "name",
          message: "파일의 이름을 입력하세요.",
          default: "index",
        },
        {
          type: "input",
          name: "directory",
          message: "파일이 위치할 폴더의 경로를 입력하세요.",
          default: ".",
        },
        {
          type: "confirm",
          name: "confirm",
          message: "생성하시겠습니까?",
        },
      ])
      .then((answers) => {
        if (answers.confirm) {
          makeTemplate(answers.type, answers.name, answers.directory);
          console.log(chalk.rgb(128, 128, 128)("터미널을 종료합니다."));
        }
      });
  }
});

program.parse(process.argv);
```

### inquirer API

- readline보다 간결해진다.
  - 커멘더의 액션이 실행되지 않은 경우 triggered가 false라서 Inquirer가 실행된다.
  - `prompt` 메서드로 상호작용 창을 띄울 수 있다.
    - type: 질문의 종류(input, checkbox, list, password, confirm 등)
    - 예제에서는 Input(평범한 답변), list(다중 택일), confirm(Yes or No) 사용
    - name: 질문의 이름, 답변 객체 속성명으로 질문의 이름을 속성 값으로 질문의 답을 가짐
    - message: 사용자에게 표시되는 문자열(여기에 질문을 적음)
    - choices: type이 checkbox, list 등인 경우 선택지를 넣는 곳(배열로)
    - default: 답을 적지 않았을 떄 기본 값
  - 예제에서는 질문 네 개를 연달아 하고 있다.
  - 질문의 name이 type, name, directory 라서 각각의 답변이 `answers.type`, `answers.name`, `answers.director`에 들어있음

```bash
% cli
? 템플릿 종류를 선택하세요. html
? 파일의 이름을 입력하세요. test
? 파일이 위치할 폴더의 경로를 입력하세요. public
? 생성하시겠습니까? Yes
public/test.html 생성 완료
터미널을 종료합니다.

% cli asdf
해당 명령어를 찾을 수 없습니다.
Usage: cli [options] [command]

Options:
  -v, --version                   output the version number
  -h, --help                      display help for command

Commands:
  template|tmpl [options] <type>  템플릿을 생성한다.
```

### 프로그램을 공유하고 싶다면?

- 만든 CLI 프로그램을 공유하고 싶다면 5장의 과정대로 npm에 배포하면 된다.
  - 다른 사용자가 npm i -g <패키지명>을 한다면 다운로드 받아 사용할 수 있음

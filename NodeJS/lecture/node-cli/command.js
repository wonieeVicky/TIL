#!/usr/bin/env node
const { program } = require("commander");
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const { version } = require("./package.json");

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

// 폴더 존재 확인 함수
const exist = (dir) => {
  try {
    fs.accessSync(dir, fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK);
    return true;
  } catch (e) {
    return false;
  }
};

// 경로 생성 함수
const mkdirp = (dir) => {
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

const makeTemplate = (type, name, directory) => {
  // 템플릿 생성 함수
  mkdirp(directory);
  if (type === "html") {
    const pathToFile = path.join(directory, `${name}.html`);
    if (exist(pathToFile)) {
      console.error(chalk.bold.red.bgBlack("이미 해당 파일이 존재합니다"));
    } else {
      fs.writeFileSync(pathToFile, htmlTemplate);
      console.log(chalk.green(pathToFile, "생성 완료"));
    }
  } else if (type === "express-router") {
    const pathToFile = path.join(directory, `${name}.js`);
    if (exist(pathToFile)) {
      console.error(chalk.bold.red("이미 해당 파일이 존재합니다"));
    } else {
      fs.writeFileSync(pathToFile, routerTemplate);
      console.log(chalk.green(pathToFile, "생성 완료"));
    }
  } else {
    console.error(chalk.bold.red("html 또는 express-router 둘 중 하나를 입력하세요."));
  }
};

// cli -v(--version) :: 버전
// cli -h(--help) :: 도움말
program.version(version, "-v, --version").name("cli");

// cli template html
// 필수정보는 <>, 보조명령어는 []
program
  .command("template <type>")
  .usage("<type> --filename [filename] --path [path]")
  .description("템플릿을 생성한다.")
  .alias("tmpl") // cli tmpl express-router
  .option("-f --filename [filename]", "파일명을 입력하세요", "index")
  .option("-d, --directory [path]", "생성 경로를 입력하세요.", ".")
  .action((type, options) => {
    console.log(type, options.filename, options.directory);
    makeTemplate(type, options.filename, options.directory);
  });

program.command("*", { noHelp: true }).action(() => {
  console.log("해당 명령어를 찾을 수 없습니다.");
  program.help(); // cli -h
});

// 그냥 cli만 실행
// program.action((cmd, args) => {});

program.parse(process.argv);

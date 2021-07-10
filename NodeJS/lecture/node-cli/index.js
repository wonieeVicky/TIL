#!/usr/bin/env node

const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin, // 콘솔에 입력
  output: process.stdout, // 콘솔에 출력
});

console.clear(); // 콘솔 지우고 시작
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

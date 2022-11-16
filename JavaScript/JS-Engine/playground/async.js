/* setImmediate(() => {
  console.log("a");
}); */
/* let a = 2;
setTimeout(() => {
  a = 5;
  // console.log("b");
}, 0);
console.log(a);
setTimeout(() => {
  console.log(a);
}, 0); */
/* Promise.resolve().then(() => {
  console.log("p");
}); */

/* let a = 2;
const p = new Promise((resolve, reject) => {
  console.log("제일 먼저");
  setTimeout(() => {
    a = 5;
    console.log(a);
    resolve(a);
  }, 0);
});

// 딴짓딴짓
console.log("딴짓");
// 딴짓딴짓
p.then((result) => {
  console.log("result:", result);
  return 1;
})
  .then((result) => {
    return Promise.resolve(1);
  })
  .then((result) => {
    console.log(result); // 1이 담긴다.
  })
  .then(() => {})
  .finally(() => {}); */

/* async function aa() {
  const a = await 1; // a = 1
  console.log("a:", a);
  console.log("---");
  await null;
  const b = await Promise.resolve(1); // b = 1
  console.log("b:", b);
  return a + b;
}

Promise.resolve(1)
  .then((a) => {
    console.log("a:", a);
    console.log("---");
    return null;
  })
  .then(() => {
    return Promise.resolve(1);
  })
  .then((b) => {
    console.log("b:", b);
    return b;
  });
 */

async function a() {
  console.log("2");
  const a = await 1; // await then
  console.log("4");
  console.log("a", a);
  console.log("----");
  await null;
  const b = await Promise.resolve(1);
  console.log("b", b);
}

console.log("1");
a()
  .then((result) => {
    console.log("result:", result);
  })
  .then((result2) => {
    console.log("result2:", result2);
  });

console.log("3");

function delayP(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  });
}

async function a() {
  await delayP(3000); // 3초
  console.log("1");
  await delayP(6000); // 6초
  console.log("2");
  await delayP(9000); // 9초
  console.log("3");
} // total 18s

async function b() {
  const p1 = delayP(3000); // 3초
  const p2 = delayP(6000); // 6초
  await Promise.allSettled([p1, p2]); // 6ch
  await delayP(9000); // 9초
} // total 15s

async function createPost() {
  const post = await db.getPost(); // 게시물 조회
  if (post) {
    res.status(403).send("이미 게시글이 존재합니다.");
  } else {
    await db.createPost(); // 게시글 작성
    const p1 = db.userIncrementPostCount(); // 사용자에 작성글 카운트 1 증가
    const p2 = db.createNoti(); // 게시글 작성 완료 알림
    await Promise.allSettled([p1.p2]);
  }
}

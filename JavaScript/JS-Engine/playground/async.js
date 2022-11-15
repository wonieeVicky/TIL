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

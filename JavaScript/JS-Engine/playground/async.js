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

let a = 2;
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
});

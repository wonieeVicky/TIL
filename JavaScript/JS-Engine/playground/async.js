/* setImmediate(() => {
  console.log("a");
}); */
let a = 2;
setTimeout(() => {
  a = 5;
  // console.log("b");
}, 0);
console.log(a);
setTimeout(() => {
  console.log(a);
}, 0);
/* Promise.resolve().then(() => {
  console.log("p");
}); */

const x = "x";
function c() {
  const y = "y";
  console.log("c");
  debugger;
}

function a() {
  const x = "x";
  console.log("a");
  function b() {
    const z = "z";
    console.log("b");
    c();
  }
  b();
}

a();
c();

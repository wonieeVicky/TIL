const x = true;
const y = false;

function a() {
  let a = 4;
  if (x) {
    let a = 3;
    for (let i = 0; i < a; i++) {
      console.log(i);
    }
    if (y) {
      kkk();
    }
  }
  z();
}

a();
const z = (a, b) => {
  return a + b;
};

z(1, 2);

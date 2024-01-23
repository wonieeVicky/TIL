console.log(this); // Window

function simpleFunc() {
  console.log(this);
}

window.simpleFunc(); // Window
simpleFunc(); // Window

console.clear();

class Counter {
  count = 0;
  // arrow func를 사용하면 this 컨텍스트를 유지할 수 있음
  increase = () => {
    console.log(this);
  };
}
const counter = new Counter();
counter.increase(); // Counter

const caller = counter.increase;
// const caller = counter.increase.bind(this); // bind를 통해 this를 counter로 고정시켜줌
caller(); // undefined...? 왜 undefined가 나올까?
// let과 const로 선언한 변수는 window에 등록되지 않는다.
// 즉, 그 어떤 object도 아니므로 undefined가 나온다.

class Vicky1 {}
const vicky1 = new Vicky1();
vicky1.run = counter.increase;
vicky1.run(); // Counter {count: 0, increase: ƒ}
// vicky1이라는 object가 this가 되었다.
// javascript에서는 this 정보를 함수를 다른 정보에 할당하는 순간 잃어버릴 수 있으므로
// 이러한 this 관계를 꽁꽁 묶으려면 bind 메서드를 써야 함

const x = {};
const y = {};

// 자바스크립트에서 모든 Object는 Object라는 Prototype을 상속한다.
console.log(x); // [[Prototype]]: Object - Object의 기본 함수를 사용할 수 있다.
console.log(y);
console.log(x.toString()); // [object Object]
console.log(x.__proto__ === y.__proto__); // true - 같은 Object Prototype을 상속하므로

const array = [];
console.log(array); // [[Prototype]]: Array - Array의 기본 함수를 사용할 수 있다.
array.push(1);
console.log(array); // [1]
array.pop();
console.log(array); // []

function CoffeeMachine(beans) {
  this.beans = beans;
  this.makeCoffee = (shots) => {
    console.log('make coffee');
  };
}

const machine1 = new CoffeeMachine(10);
const machine2 = new CoffeeMachine(20);
console.log(machine1); // CoffeeMachine { beans: 10, makeCoffee:f, [[Prototype]]: Object }
console.log(machine2); // CoffeeMachine { beans: 20, makeCoffee:f, [[Prototype]]: Object }

function CoffeeMachine2(beans) {
  this.beans = beans;
}
// Prototype member level
CoffeeMachine2.prototype.makeCoffee = (shots) => {
  console.log('make coffee');
};

const machine3 = new CoffeeMachine2(10);
const machine4 = new CoffeeMachine2(20);
console.log(machine3); // CoffeeMachine { beans: 10, [[Prototype]]: { makeCoffee: (shots) => {...}, ...args } }
console.log(machine4); // CoffeeMachine { beans: 20, [[Prototype]]: { makeCoffee: (shots) => {...}, ...args } }

function LatteMachine(milk) {
  this.milk = milk;
}
LatteMachine.prototype = Object.create(CoffeeMachine2.prototype); // CoffeeMachine2의 Prototype을 상속받는다.
const latteMachine = new LatteMachine(123);
console.log(latteMachine); // LatteMachine { milk: 123, [[Prototype]]: CoffeeMachine2 }
latteMachine.makeCoffee(); // make coffee - CoffeeMachine2의 Prototype을 상속받았으므로 사용 가능

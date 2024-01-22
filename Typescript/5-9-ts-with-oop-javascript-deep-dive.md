## 자바스크립트 딥다이브

### JavaScript Deep Dive

TypeScript는 JavaScript 기반의 superset이므로 딥다이브 해 볼 필요가 있다.

### Prototype

프로토타입을 어렵게 생각하지 말자.

JavaScript도 엄밀히 말하면 객체지향 프로그래밍 언어이다.

Proto-based로 객체 지향 프로그래밍 구현이 가능하기 때문

ES6에서 나온 class도 프로토타입을 기반으로 함

즉, JavaScript에서 프로토타입은 굉장히 근본적인 개념임

프로토타입은 상속(Inheritance)를 위해서 사용함

Prototype-based Programming은 객체 지향 프로그래밍을 할 수 있는 한 가지의 방법으로서 행동을 재사용(상속)할 수 있고, 기존의 객체를 재사용할 수 있음

### Prototype Demo

데모 코드를 이용해서 프로토타입을 더 이해해보자

```jsx
const x = {};
const y = {};

// 자바스크립트에서 모든 Object는 Object라는 Prototype을 상속한다.
console.log(x); // [[Prototype]]: Object - Object의 기본 함수를 사용할 수 있다.
console.log(y);
console.log(x.toString()); // [object Object]
console.log(x.__proto__ === y.__proto__); // true - 같은 Object Prototype을 상속하므로

// 배열로 정의하면 자동으로 Array Prototype을 상속, 그 내부에는 Object Prototype도 연결됨
const array = [];
console.log(array); // [[Prototype]]: Array - Array의 기본 함수를 사용할 수 있다.
array.push(1);
console.log(array); // [1]
array.pop();
console.log(array); // []
```

위 코드에서 알 수 있듯 자바스크립트에서 모든 객체는 Object.Prototype을 상속한다. (콘솔 찍어보며 확인..)

```jsx
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
```

만약 위와 같은 코드가 있다고 했을 때, machine1과 machine2는 각 beans와 makeCoffee를 상속받고, 기본 Object.Prototype을 상속하는 것을 알 수 있다.

그렇다면 아래와 같이 처리하면 어떻게 될까?

```jsx
function CoffeeMachine2(beans) {
  this.beans = beans;
}
// Prototype member level
CoffeeMachine2.prototype.makeCoffee = (shots) => {
  console.log('make coffee');
};
```

CoffeeMachine2로 생성자 함수를 만들었을 때에 찍히는 인스턴스는 어떤 구조로 값을 가지고 있을까?

```jsx
const machine3 = new CoffeeMachine2(10);
const machine4 = new CoffeeMachine2(20);
console.log(machine3); // CoffeeMachine { beans: 10, [[Prototype]]: { makeCoffee: (shots) => {...}, ...args } }
console.log(machine4); // CoffeeMachine { beans: 20, [[Prototype]]: { makeCoffee: (shots) => {...}, ...args } }
```

Prototype 내에 멤버 레벨로 makeCoffee가 상속되어 있음을 알 수 있음

```jsx
function LatteMachine(milk) {
  this.milk = milk;
}
```

만약 위와 같은 LatteMachine이라는 생성자 함수가 추가되었고, 이 생성자가 기본적으로 CoffeeMachine2의 데이터를 상속받도록 하고 싶다면 어떻게 할 수 있을까?

```jsx
// CoffeeMachine2의 Prototype을 상속받는다.
LatteMachine.prototype = Object.create(CoffeeMachine2.prototype);

const latteMachine = new LatteMachine(123);
console.log(latteMachine); // LatteMachine { milk: 123, [[Prototype]]: CoffeeMachine2 }

latteMachine.makeCoffee(); // make coffee - CoffeeMachine2의 Prototype을 상속받았으므로 사용 가능
```

`Object.create`로 `CoffeeMachine2`의 prototype을 연결해주면 LatteMachine 내부에서도 makeCoffee 함수를 사용할 수 있게됨. 상속받았기 때문!

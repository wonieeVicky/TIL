## 10. Object - 2

자바스크립트에는 class 없다. 그렇지만 모습이 비슷한 class 키워드가 생겼다. (그러나 결국 함수다.)

### class를 통한 객체 생성

```jsx
function Health(name) {
  this.name = name;
}

Health.prototype.showHealth = function () {
  console.log(this.name + "님 안녕하세요");
};

const h = new Health("vicky");
h.showHealth(); // vicky님 안녕하세요

// ES6 Class
class Health {
  constructor(name, lastTime) {
    this.name = name;
    this.lastTime = lastTime;
  }

  showHealth() {
    console.log("안녕하세요. " + this.name);
  }
}

const myHealth = new Health("vicky");
myHealth.showHealth(); // 안녕하세요. 비키
console.log(toString.call(Health)); // function
```

### 프로토타입을 활용한 순수한 JS객체 만들기

기존에는 JS 객체를 만들 때, 객체 내에 데이터를 추가하려면 아래와 같이 추가했다.

```jsx
const healthObj = {
  showHealth: function () {
    console.log("오늘은 운동시간: " + this.healthTime);
  },
};

const myHealth = Object.create(healthObj);
myHealth.healthTime = "11: 20 AM";
myHealth.name = "vicky";

console.log(myHealth); // { healthTime: "11: 20 AM", name: "vicky"}, __proto__: showHealth: ƒ ()
myHealth.showHealth(); // 오늘은 운동시간: 11: 20 AM
```

그러나 ES5의 `Object.assign` 메서드를 이용하면 데이터를 한번에 추가할 수 있다.

```jsx
const healthObj = {
  showHealth: function () {
    console.log("오늘은 운동시간: " + this.healthTime);
  },
};

const myHealth = Object.assign(Object.create(healthObj), {
  name: "vicky",
  healthTime: "11: 20 AM",
});

console.log(myHealth); // { healthTime: "11: 20 AM", name: "vicky"}, __proto__: showHealth: ƒ ()
myHealth.showHealth(); // 오늘은 운동시간: 11: 20 AM
```

### Object assign으로 Immutable 객체 만들기

`Object.assign` 은 새로운 객체 즉, Immutable 객체를 만드는 방법이기도 하다.
(내부 값 비교는 Immutable 대상이 아님)

```jsx
const previousObj = {
  name: "vicky",
  lastTime: "11: 20 AM",
};

const myHealth = Object.assign({}, previousObj, {});

console.log(previousObj === myHealth); // false
console.log(previousObj.name === myHealth.name); // true
```

또한 값 생성 시 같은 Key 값의 데이터일 경우 오버라이드 되어 저장된다.

```jsx
const previousObj = {
  name: "vicky",
  lastTime: "11: 20 AM",
};

const myHealth = Object.assign({}, previousObj, {
  lastTime: "12: 30 PM",
  name: "wonny",
  age: 32,
});

console.log("my name is " + myHealth.name); // my name is wonny
console.log("last time: " + myHealth.lastTime); // last time: 12: 30 PM
```

위와 같은 방식으로 이전과 새로운 값에 대한 비교나 이전 값을 되돌리기 기능 등에 `Object.assign`을 활용할 수 있다.

### Object setPrototypeOf로 객체 만들기

`setPrototypeOf` 메서드는 객체에 **프로토타입 객체를 추가 설정하는 메서드**이다.

- 예전에는 `Object.prototype.__proto__`를 사용했다면, 이제는 `setPrototypeOf` 메서드로 쉽게 정의할 수 있다.
- `Object.assign` 메서드와 같이 객체를 합쳐주는 기능에서 유사하지만,  
  값의 오버라이드 등이 불가하며 단순히 프로토타입 프로퍼티 내 객체를 추가하는 역할만 가능하다.

```jsx
const healthObj = {
  showHealth: function () {
    console.log("오늘은 운동시간: " + this.healthTime);
  },
  setHealth: function (newTime) {
    this.healthTime = newTime;
  },
};

const myHealth = {
  lastTime: "11:20",
  name: "vicky",
};

console.log("myHealth is ", myHealth); // { lastTime: "11:20", name: "vicky" }

// 프로토타입 객체 추가
Object.setPrototypeOf(myHealth, healthObj);

console.log("myHealth is ", myHealth); // { lastTime: "11:20", name: "vicky" }, __proto__: showHealth: ƒ (), setHealth:  ƒ ()
```

이렇게 직접 객체를 추가해줘도 된다.

```jsx
const healthObj = {
  showHealth: function () {
    console.log("오늘은 운동시간: " + this.healthTime);
  },
  setHealth: function (newTime) {
    this.healthTime = newTime;
  },
};

const newObj = Object.setPrototypeOf(
  {
    lastTime: "11:20",
    name: "vicky",
  },
  healthObj
);

console.log(newObj); // { lastTime: "11:20", name: "vicky" }, __proto__: showHealth: ƒ (), setHealth:  ƒ ()
```

이 메서드를 어떻게 쓸 수 있을까? 특정 모듈(클래스)을 만들 때 활용하면 좋다.

### Object setPrototypeOf로 객체 간 prototype chain 생성하기

만약 이미 구성된 다른 객체와 함께 조합하여 사용하고 싶다면 어떻게 할까?  
`setPrototypeOf` 메서드를 활용해 프로토타입 체인을 생성하면 사용이 가능하다. 아래의 예시를 살펴보자

```jsx
// parent obj
const healthObj = {
  showHealth: function () {
    console.log("오늘은 운동시간: " + this.healthTime);
  },
  setHealth: function (newTime) {
    this.healthTime = newTime;
  },
};

// child obj
const healthChildObj = {
  getAge: function () {
    return this.age;
  },
};

// 이미 구성된 다른 객체를 이용하고 싶다면..
Object.setPrototypeOf(healthChildObj, healthObj); // healthChildObj 변경

const childObj = Object.setPrototypeOf(
  {
    age: 22,
  },
  healthChildObj
);

// 프로토타입 체인으로 연결되어있는 것을 확인할 수 있다.
// console.log('childObj is ", childObj); // { age: 22 }, __proto__: getAge: ƒ (), __proto__: showHealth: ƒ (), setHealth:  ƒ ()

childObj.setHealth("11:55");
childObj.showHealth("11:55"); // 오늘은 운동시간: 11:55
```

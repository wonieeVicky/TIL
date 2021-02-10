# 클래스

- 프로토타입 문법을 깔끔하게 작성할 수 있는 Class 문법 도입
  - Constructor(생성자), Extends(상속) 등을 깔끔하게 처리할 수 있다.
  - 코드가 그룹화되어 가독성이 향상된다.
- 예시 1

```jsx
// 생성자
var Human = function(type){
	this.type = type || 'human';
};
// static method
Human.isHuman = function(human){
	return human instanceof Human;
}
// instance method
Human.prototype.breathe = function(){
	alert('h-a-a-a-m');
}

// 위와 같이 별도로 되어있던 코드가 class로 묶이면 아래와 같이 된다.
class Human {
	constructor(type = 'human'){
		this.type = type;
	}
	static isHuman(human){
		return human instancof Human;
	}
	breathe(){
		alert('h-a-a-a-m');
	}
}
```

- 예시 2

```jsx
var Vicky = function (type, firstName, lastName) {
  Human.apply(this, arguments);
  this.firstName = firstName;
  this.lastName = lastName;
};

Vicky.prototype = Object.create(Human.prototype);
Vicky.prototype.constructor = Vicky; // 상속하는 부분
Vicky.prototype.sayName = function () {
  alert(this.firstName + " " + this.lastName);
};
var oldVicky = new Vicky("human", "Vicky", "Choi");
Human.isHuman(oldVicky); // true

// 위과 같은 코드를 class로 묶으면 아래와 같이 된다.
class Vicky extends Human {
  constructor(type, firstName, lastName) {
    super(type);
    this.firstName = firstName;
    this.lastName = lastName;
  }

  sayName() {
    super.breathe();
    alert(`${this.firstName} ${this.lastName}`);
  }
}
const newVicky = new Vicky("human", "Vicky", "Choi");
```

# 클래스

타입스크립트의 클래스를 이해하기 위해서는 먼저 자바스크립트의 클래스를 이해해야 한다. 클래스 문법은 자바스크립트에서 ES2015(ES6)에 신규로 추가된 문법으로 클래스가 하는 역할은 기본적으로 인스턴스를 생성하는 것이 가장 주된 역할이다.

```jsx
class Person {
  // 클래스 로직
  // 초기화 메서드
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
}

var vicky = new Person('wonny', 32);
console.log(vicky); // Person { name: 'wonny', age: 32 }
```

위와 같이 선언하면 `vicky`라는 변수에 class Person에 넘겼던 속성들이 포함되어 Person 객체를 담을 수 있다. 이러한 클래스 문법을 왜 써야하고, 이것이 타입스크립트와 어떤 관계가 있는 것일까?

## 자바스크립트 프로토타입

클래스를 쓰는 이유를 알기 위해서는 먼저 자바스크립트가 프로토타입 기반의 언어라는 것을 알아야 한다. 그렇다면 프로토타입은 어떤걸까?

```jsx
var user = { name: 'vicky', age: 32 };
var admin = { 'vicky', age: 32, role: 'admin' };
```

위와 같이 name과 age라는 속성을 가진 user 객체가 있다고 했을 때 해당 객체에 추가적으로 역할을 의미하는 role 이라는 속성을 추가한 admin 이라는 변수를 만들어야 한다고 가정해보자. 그러면 admin이라는 변수에 같은 user의 값을 다시 추가로 작성한 뒤 role이라는 속성을 추가해야 하는데, 만약 전달되는 객체의 값이 클 경우 불필요한 비용이 발생하는 코드가 된다.

이럴 때 코드를 줄이는 방법 중에 상속을 활용한 개념이 필요하다.

```jsx
var user = { name: 'vicky', age: 32 };
var admin = {};
admin.__proto__ = user;

admin.name; // vicky
admin.agel; // 32
```

위와 같이 admin의 프로토타입 객체(**proto**)에 user를 대입해주면 이후 admin은 name과 age 값을 상속받을 수 있다. 물론 admin 자체의 값은 여전히 빈 객체이지만 admin의 프로토타입 객체에 해당 속성들이 추가되는 것이다.

```jsx
admin; // {}
admin.role = 'admin';

admin; // {}, __proto__: { name: 'vicky', age: 32 }
```

바로 위와 같이 말이다. admin의 직접적인 값은 role이라는 속성만을 지니지만, 또한 name과 age의 값도 지니는데 현재 활성 객체에 값이 없으면 자신의 프로토타입 객체에 있는 상위 객체의 활성 객체에서 name과 age의 값에 접근하는 이러한 성질을 `프로토타입 체인`이라고 한다.

우리는 이러한 상속 개념을 문자나 숫자, 함수, 객체 등에서 이미 사용하고 있다.

## 자바스크립트 프로토타입 활용 사례

```jsx
var obj = { a: 10 };
```

위와 같이 object가 있다고 했을 때 obj 객체가 사용할 수 있는 기본 함수는 굉장히 많다. 예를 들면 Object.keys() 메서드나 hasOwnProperty, toLocaleString 등에 대한 기본적인 객체관련 함수에 접근할 수 있다. 이러한 기본적인 메서드들은 어디서 선언되어 바로 사용되어지는 것일까? 바로 프로토타입 객체를 통해 지정되어진 기본 Object 메서드에 정의되어진 메서드를 상속받아서 사용할 수 있게 되는 것이다. 이렇게 기본적인 자바스크립트의 원시데이터에 사용할 수 있는 메서드를 Built-in JavaScript API 또는 JavaScript Native API라고 한다.

이 개념은 이미 자바스크립트에서 사용되어지던 개념이며 이렇게 상속으로 주어진 기본 메서드와 사용자가 지정한 프로토타입 상속을 통해 값을 전달받고 사용할 수 있는 구조를 가진 것이라고 생각하면 된다. 다시 돌아가서 admin 객체를 생각해보면 admin 객체의 값은 { role: 'admin' } 이며, 그 내부의 `__proto__` 객체로 admin 을 상속받고 해당 상속 안에 또 `__proto__`객체로 기본 Object Built-in JavaScript API를 상속받아 기본적인 Object 메서드와, admin 객체에 접근할 수 있는 것이다. 😊

## 프로토타입과 클래스와의 관계

또한, 클래스 문법은 사실 클래스 "함수"로 원래는 프로토타입을 활용한 new 생성자 함수로 만들 수 있었던 개념을 class 문법으로 더 보기좋게 사용하기 위해 만들어진 일종의 syntatic sugar이다. 즉 위의 Person 클래스 객체는 아래의 생성자 함수로 만든 Person 생성자 객체와 완벽하게 일치한다.

```jsx
function Person(name, age) {
  this.name = name;
  this.age = age;
}
var vicky = new Person('wonny', 32);
```

class 함수가 만들어진 이유는 class 기반으로 객체 지향 프로그래밍을 하는데 익숙한 개발자들이 쉽게 자바스크립트를 사용할 수 있도록하기 위해서이다. 실제적으로 내부의 코드의 구조는 기존의 prototype 기반의 상속을 기반으로 만들어졌다는 것을 다시한번 기억하자!

## 타입스크립트의 클래스 문법

그렇다면 타입스크립트 클래스는 기존의 ES6의 클래스와 어떤 점이 다를까?  
먼저 타입스크립트용 클래스는 먼저 클래스 객체 내부에서 사용할 멤버 변수에 대한 타입선언이 반드시 필요하다.

```tsx
class Person {
  // 접근범위를 설정할 수 있다.
  private name: string;
  public age: number;
  readonly log: string; // 읽기 전용 속성

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
}
```

특히 타입스크립트를 클래스 함수에서 사용할 경우 변수에 대한 접근범위도 함께 설정할 수 있다. (자바스크립트에서 접근범위는 `#`를 앞에 붙여주면 private 변수를 선언할 수 있음) 이러한 클래스 객체에 사용되어진 typscript 문법은 이후 제네릭을 배울 때 필요하니 숙지해두자.

오늘날 함수형 프로그래밍이 많이 발전되면서 클래스형 프로그래밍 즉 객체지향 프로그래밍이 많이 사용되고 있지는 않지만, 개발을 함에 있어 해당 이론을 반드시 알어야하므로 다시한번 복기해두자 : )

# 연산자를 이용한 타입 정의

## Union Type

### 유니온 타입(|)

유니온 타입(Union Type)이란 특정 타입 즉 하나의 타입 이상을 쓸 수 있도록 만들어주는 타입 정의 방법이다.

```tsx
function logMessage(value: string | number) {
  console.log(value);
}
logMessage('hello');
logMessage(100);
```

### 유니온 타입의 장점

유니온 타입을 사용했을 때 타입 가드\* 기능을 잘 활용할 수 있다.
타입 가드 기능이란 특정 타입으로 타입의 범위를 좁혀나가는(필터링 하는) 과정이다.

```tsx
function logMessage(value: string | number) {
  if (typeof value === 'number') {
    // IDE가 number에서만 사용할 수 있는 메서드나 속성을 타입 가드로 지원한다.
    value.toLocaleString();
  }
  if (typeof value === 'string') {
    // IDE가 string에서만 사용할 수 있는 메서드나 속성을 타입 가드로 지원한다.
    value.toString();
  }
  throw new TypeError('value must be string or number');
}
logMessage('hello');
logMessage(100);
```

### 유니온 타입의 특징

유니온 타입으로 interface 타입정의를 두 개 연결하면 하위 name, skill, age에 대한 모든 속성의 타입이 보장될 거라고 생가하지만 그렇지않다. 공통 속성인 name만 타입 보장을 해주고 기타 skill, age는 type error가 나옴 이 경우에는 타입 가드를 통해 추가적으로 처리를 해줘야 에러가 발생하지 않는다.

```tsx
interface Developer {
  name: string;
  skill: string;
}
interface Person {
  name: string;
  age: number;
}

// Developer 혹은 Person 타입이 someone에 지정
function askSomeone(someone: Developer | Person) {
  someone.name; // ok, 공통 속성인 name만 보장, 접근이 가능하다.
  someone.skill; // type error
  someone.age; // type error
}
```

## 인터섹션 타입 소개

&연산자를 사용한 인터섹션 타입이 있다. 인터섹션 타입을 사용할 경우 여러개의 타입을 모두 포함(혹은 연결)하게 지정하므로 아래 name, skill, age에 대한 타입 보장을 해준다.

```tsx
interface Developer {
  name: string;
  skill: string;
}
interface Person {
  name: string;
  age: number;
}

// Developer와 Person 타입이 모두 someone에 지정
function askSomeone(someone: Developer & Person) {
  someone.name; // ok
  someone.skill; // ok
  someone.age; // ok
}
```

## 유니온 타입과 인터섹션 타입의 차이점

실제 유니온 타입보다 인터섹션 타입을 많이 쓸 것 같지만, 실무에서는 보통 유니온 타입을 더 많이 사용한다.

아래는 위 Developer와 Person 타입을 유니온 타입으로 부여한 경우이다. 해당 함수를 실제 호출해볼 때 Developer의 Object 데이터 혹은 Person의 Object 데이터를 주면 별다른 타입 에러가 발생하지 않는다.

```tsx
function askSomeone(someone: Developer | Person) {
  /* code... */
}

askSomeone({ name: '비키', skill: '웹 개발' }); // Developer의 데이터를 준다.
askSomeone({ name: '워니', age: 32 }); // Person의 데이터를 준다.
```

하지만 아래와 같이 Developer와 Person을 &연산자를 이용한 인터섹션 타입으로 정의하면 여러개의 타입이 모두 포함되는 새로운 타입이 만들어지는 개념과 비슷하므로 타입 에러가 발생한다.

```tsx
// Developer + Person이라는 새로운 유형이 생김
function askSomeone(someone: Developer & Person) {
  /* code... */
}

askSomeone({ name: '비키', skill: '웹 개발' }); // error, age가 없다!
askSomeone({ name: '워니', age: 32 }); // error, skill이 없다.
```

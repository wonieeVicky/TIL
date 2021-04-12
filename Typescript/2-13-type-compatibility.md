# 타입 호환

타입 호환(Type Compatibility)이란 타입스크립트 코드에서 특정 타입이 다른 타입에 잘 맞는지, 즉 타입스크립트가 코드를 해석해나가는 과정에서 두 개의 타입이 서로 호환이 되는지 점검하는 것을 타입 호환이라 한다.

```tsx
interface Ironman {
  name: string;
}

class Avengers {
  name: string;
}

let i: Ironman;
i = new Avengers(); // OK, because of structural typing
```

C#이나 Java였다면 위 코드에서 에러가 날 것이다. 왜냐면 `Avengers` 클래스가 명시적으로 `Ironman` 인터페이스를 상속받지 않았기 때문이다. 하지만, 위 코드가 타입스크립트에서는 정상적으로 동작한다.
그 이유는 자바스크립트의 작동 방식과 관련이 있는데, 기본적으로 자바스크립트는 객체 리터럴이나 익명 함수 등을 사용하기 때문에 명시적으로 타입을 지정하는 것보다는 코드의 구조 관점에서 타입을 지정하는 것이 더 잘 어울린다.

## 구조적 타이핑 예시

구조적 타이핑(structural typing)이란 코드 구조 관점에서 타입이 서로 호환되는지의 여부를 판단하는 것이다.

```tsx
interface Avengers {
  name: string;
}

let hero: Avengers;
// 타입스크립트가 추론한 hero의 타입은 { name: string; location: string; }이다.
let capt = { name: "Wonny", location: "Vicky" };
hero = capt;
```

위 코드에서 `capt`가 `hero` 타입에 호환될 수 있는 이유는 `capt`의 속성 중 `name`이 있기 때문으로 `Avengers` 인터페이스에서 `name` 속성을 가지고 있어 `capt`는 `Avengers` 타입에 호환될 수 있다.

### 타입 호환 예제 - 인터페이스, 클래스

```tsx
interface Developer {
  name: string;
  skill: string;
}

interface Person {
  name: string;
}
var developer: Developer;
var person: Person;

developer = person; // 1. Type Error! person에는 name 속성만 있고, developer는 더 많은 타입 범주를 가지고 있기 때문
person = developer; // 2. OK, person보다 developer의 타입 범주가 더 크기 때문에 호환이 가능함
```

위와 같이 `name`과 `skill` 속성을 가진 `Developer`와 `name` 속성만 가진 `Person` 타입이 있고, 해당 타입을 각각 `developer`, `person` 변수에 담아준 뒤 각 변수 에 서로 값을 대입하는 과정에서 타입 호환이 어떻게 갈리는지를 볼 수 있다.

1. 타입 에러가 발생한다. 왼쪽 변수인 `developer`가 `person`보다 더 큰 타입 범주를 가지고 있기 때문이다. 즉 `person`에는 `name` 속성만 있어서 `skill` 속성까지 있는 `developer`에 대입 시 타입 호환 에러 발생
2. 정상적으로 타입호환이 된다.
   왼쪽 변수인 `person` 보다 `developer`가 더 큰 타입 범주를 가지고 있기 때문이다.

클래스를 사용하면 어떨까?

```tsx
interface Developer {
  name: string;
  skill: string;
}

class Person {
  name: string;
}

var developer: Developer;
var person: Person;

developer = new Person(); // Error Occured!
```

동일하게 class 타입 객체인 Person을 동일하게 대입해주어도 타입 호환 에러가 발생한다.

이처럼 타입 호환에서는 타입 선언방식(예를 들어 interface인지, class인지)은 중요치 않고 타입을 이루는 속성이 각각 어떻게 되는지 직접 비교하여 타입을 호환한다.

### 타입 호환 예제 - 함수, 제네릭

함수와 제네릭 타입에서의 타입 호환성도 살펴보자. 먼저 함수에 대한 타입 호환성이다.

```tsx
var add = function (a: number) {
  // ...
};

var sum = function (a: number, b: number) {
  // ...
};

sum = add; // 1. OK!
add = sum; // 2. Type Error
```

위 두 변수 `add`, `sum`은 인자 값만 차이가 있다. (내부 로직은 중요치 않다.) 우선 sum에서 받아야하는 인자값이 add 함수 보다 더 많으므로 sum 함수의 타입 구조가 add 함수보다 더 크다라고 할 수 있다.

1. sum 변수에 add 변수를 대입하면 문제없이 타입체크가 된다. sum은 a, b 두 개의 인자를 받아들여 add보다 더 큰 타입 구조를 가지므로 add 함수가 가진 타입을 호환할 수 있기 때문이다.
2. add 변수에 sum 변수를 대입하면 타입 에러가 발생한다. add 변수는 a라는 하나의 인자만 필요하므로 a, b 두 개의 인자를 타입으로 가지고 있는 sum 변수의 타입 구조가 더 커서 타입 호환이 되지 않기 때문이다.

제네릭을 사용한 경우도 살펴보면 아래와 같다.

```tsx
interface Empty<T> {
  // ..
}

var empty1: Empty<string>;
var empty2: Empty<number>;

empty1 = empty2; // 1. OK
empty2 = empty1; // 1. OK

interface NotEmpty<T> {
  data: T;
}

var notempty1: NotEmpty<string>;
var notempty2: NotEmpty<number>;

notempty1 = notempty2; // 2. Type Error!
notempty2 = notempty1; // 2. Type Error!
```

1. 1번의 경우 각 변수를 서로 대입해줘도 정상적으로 컴파일된다. 이유는 Empty라는 인터페이스 타입 객체에 제네릭이 어떠한 속성도 담고 있지 않기 때문이다. 따라서 string ↔ number에 대한 타입 호환이 가능하다.
2. 하지만 NotEmpty 인터페이스를 보면 제네릭으로 받은 타입이 data란 속성으로 반환되어지므로 각 변수에 대입을 해줬을 떄 타입 에러를 발생시킨다.

## 제네릭 이해하기

### Generic

지난 시간에 만들어본 Stack 클래스는 문자열만 사용 가능하다.
숫자나 다른 객체를 전달인자로 사용할 수 있도록 하려면? 제네릭을 사용하면 된다.

제네릭은 유연하고, 타입을 보장하며, 재사용성을 높일 수 있다.

### 함수에서 제네릭

```tsx
function checkNotNullBad(arg: number | null): number {
  if (arg == null) {
    throw new Error('not valid number!');
  }
  return arg;
}
const result = checkNotNullBad(123); // 123
checkNotNullBad(null); // ErcheckNotNullBadror: not valid number!
```

위와 같이 함수가 있다고 했을 때 함수의 확장은 number로만 구현이 가능하다.

```tsx
// 타입의 정보가 없어지므로 any를 사용하면 좋지 않다.
function checkNotNullAnyBad(arg: any | null): any {
  if (arg == null) {
    throw new Error('not valid number!');
  }
  return arg;
}
const result = checkNotNullAnyBad(123); // any로 추론
```

이를 개선하고자 위처럼 타입 정의를 any로 설정한다면 모든 타입에 대한 정보가 사라지므로 좋지 않음..

이때 제네릭을 아래와 같이 구현할 수 있다.
제네릭은 통상적인, 일반적인을 의미하는 단어로 코딩 시 타입이 결정되어 타입 보장의 확장성을 유연하게 가져갈 수 있다.

```tsx
function checkNoNullWithGeneric<GENERIC>(arg: GENERIC | null): GENERIC {
  if (arg == null) {
    throw new Error('not valid number!');
  }
  return arg;
}
const number = checkNoNullWithGeneric(123); // number로 타입 추론
const string = checkNoNullWithGeneric('123'); // string으로 타입 추론
const bool = checkNoNullWithGeneric(false); // boolean으로 타입 추론
```

제네릭 사용 시 키는 단순한 알파벳으로 처리함

```tsx
function checkNoNullWithGeneric<T>(arg: T | null): T {
  if (arg == null) {
    throw new Error('not valid number!');
  }
  return arg;
}
```

### 클래스에서 제네릭 사용하기

그럼 클래스 레벨에서 제네릭을 어떻게 사용하는지 알아보자!
Either는 A or B라는 의미를 가지고 있는데, 이러한 의미를 담는 SimpleEither 클래스가 있다고 하자

```tsx
interface Either {
  left: () => number;
  right: () => number;
}

class SimpleEither implements Either {
  constructor(private leftValue: number, private rightValue: number) {}

  left(): number {
    return this.leftValue;
  }

  right(): number {
    return this.rightValue;
  }
}

const either = new SimpleEither(4, 5);
```

위 클래스는 Either 인터페이스 타입을 상속받는 클래스로, leftValue, rightValue의 타입이 number로 지정되어 있다.
이 클래스의 경우 반드시 number 타입의 인자만 넣어 사용할 수 있다.

만약 인자를 다양한 타입으로 구성하고 싶다면? 제네릭을 쓴다.

```tsx
interface Either<L, R> {
  left: () => L;
  right: () => R;
}

class SimpleEither<L, R> implements Either<L, R> {
  constructor(private leftValue: L, private rightValue: R) {}

  left(): L {
    return this.leftValue;
  }

  right(): R {
    return this.rightValue;
  }
}

const either: Either<number, number> = new SimpleEither(4, 5);
either.left(); // 4
either.right(); // 5

const best = new SimpleEither(3, 'vicky'); // const best: SimpleEither<number, string>
const name = new SimpleEither({ name: 'vicky' }, 'hello'); // const name: SimpleEither<{name: string}, string>
```

위와 같이 다양한 타입의 인자를 전달하고, 이에 따라 각 인자별 타입이 적절하게 추론된 것을 확인해볼 수 있음

### 제네릭 조건

제네릭에 조건을 줘보자. 아래와 같이 풀타임 고용인, 파트타임 고용인 클래스가 있다고 하자

```tsx
interface Employee {
  pay(): void;
}

class FullTimeEmployee implements Employee {
  pay() {
    console.log(`full time!!`);
  }
  workFullTime() {}
}

class PartTimeEmployee implements Employee {
  pay() {
    console.log(`part time!!`);
  }
  workPartTime() {}
}

function pay(employee: Employee): Employee {
  employee.pay();
  return employee;
}

const vicky = new FullTimeEmployee();
const wonny = new PartTimeEmployee();

vicky.workFullTime(); // workFullTime을 사용할 수 있음
wonny.workPartTime();
```

위와 같이 각 클래스별 생성자를 호출하여 내부 함수를 실행시켰다.
이후 pay 지급을 한 뒤 반환된 객체를 아래와 같이 정의한다면.

```tsx
const vickyAfterPay = pay(vicky);
const wonnyAfterPay = pay(wonny);

vickyAfterPay.workFullTime(); // Error :: 'Employee' 형식에 'workFullTime' 속성이 없습니다.
```

`vickyAfterPay.workFullTime();` 에서 workFullTime 속성이 존재하지 않는다는 에러가 발생한다.
pay 함수 실행 후 반환되는 `employee` 속성에서 각 세부 클래스 정보를 잃어버렸기 때문

이것을 개선하기 위해선 아래와 같이 타입을 가두는 방법이 있다.

```tsx
const vickyAfterPay = pay(vicky) as FullTimeEmployee;
const wonnyAfterPay = pay(wonny) as PartTimeEmployee;
```

하지만 `as` 사용은 비추이다.

```tsx
// 세부적인 타입을 인자로 받아서 추상적인 타입으로 다시 리턴하는 함수는 💩
function pay(employee: Employee): Employee {
  employee.pay();
  return employee;
}
```

즉 pay 함수가 잘못되었다는 것을 의미. 이를 제네릭을 활용해 개선해볼 수 있다.

```tsx
function pay<T extends Employee>(employee: T): T {
  employee.pay();
  return employee;
}
```

`<T extends Employee>` 라는 뜻은 T가 Employee 인터페이스에서 확장한 객체만 전달할 수 있다고 정의하는 것임

### 제네릭 조건2

위 조건 처리에 대한 추가 예제를 살펴보자

```tsx
const obj = {
  name: 'vicky',
  age: 33
};
const obj2 = {
  language: 'javascript'
};

console.log(getValue(obj, 'name')); // vicky
console.log(getValue(obj, 'age')); // 33
console.log(getValue(obj2, 'language')); // javascript
```

위와 같이 각 속성 키가 다른 obj, obj2가 있을 때, 위 `getValue`라는 함수에 대한 타입 정의는 어떻게 할 수 있을까?

```tsx
function getValue<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```

위와 같이 타입정의를 할 수 있음. `K extends keyof T`는 T의 object key 값이 K 값임을 의미함..

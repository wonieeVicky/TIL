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

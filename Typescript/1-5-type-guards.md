## 타입 가드(Guards)

아래의 예제와 같이 `val`의 타입을 매번 보장하기 위해 타입 단언을 여러 번 사용하게 되는 경우가 있다.

```tsx
function someFunc(val: string | number, isNumber: boolean) {
  if (isNumber) {
    (val as number).toFixed(2);
    isNaN(val as number);
  } else {
    (val as string).split("");
    (val as string).toUpperCase();
    (val as string).length;
  }
}
```

이 경우 타입 가드를 제공하면 타입스크립트가 추론 가능한 특정 범위(scope)에서 타입을 보장할 수 있다. 타입 가드는 `NAME is TYPE` 형태의 **타입 술부(Predicate)를 반환 타입으로 명시한 함수**이다.

아래의 예제에서 타입 술부는 `val as number`이다. 타입 단언이 없어지니 훨씬 깔끔해보인다.

> [술부]: 주어의 상태, 성질 따위를 서술하는 말.

```tsx
// 타입 가드
function isNumber(val: string | number): val is number {
  return typeof val === "number";
}

function someFunc(val: string | number) {
  if (isNumber(val)) {
    val.toFixed(2);
    isNaN(val);
  } else {
    val.split("");
    val.toUpperCase();
    val.length;
  }
}
```

위 방식 뿐만 아니라 제공이 가능한 타입 가드가 더 있다. `typeof`, `in` 그리고 `instanceof` 연산자를 직접 사용하는 타입 가드로 비교적 단순한 로직에서 추천되는 방식이다.

> `typeof` 연산자는 `number`, `string`, `boolean` 그리고 `symbol`만 타입 가드로 인식할 수 있다.  
> `in` 연산자의 우변 객체(`val`)은 `any` 타입이어야 한다.

```tsx
// 기존 예제와 같이 `isNumber`를 제공(추상화)하지 않아도 `typeof` 연산자를 직접 사용하면 타입 가드로 동작한다.
// https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/typeof
function someFuncTypeof(val: string | number) {
  if (typeof val === "number") {
    val.toFixed(2);
    isNaN(val);
  } else {
    val.split("");
    val.toUpperCase();
    val.length;
  }
}

// 별도의 추상화 없이 `in` 연산자를 사용해 타입 가드를 제공할 수도 있다.
// https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/in
function someFuncIn(val: any) {
  if ("toFixed" in val) {
    val.toFixed(2);
    isNaN(val);
  } else if ("split" in val) {
    val.split("");
    val.toUpperCase();
    val.length;
  }
}

// 역시 별도의 추상화 없이 `instanceof` 연산자를 사용해 타입 가드를 제공할 수도 있다.
// https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/instanceof
class Cat {
  meow() {}
}
class Dog {
  woof() {}
}
function sounds(ani: Cat | Dog) {
  if (ani instanceof Cat) {
    ani.meow();
  } else {
    ani.woof();
  }
}
```

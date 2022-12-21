## lib.es5.d.ts 분석

> lib.es5.d.ts 훌륭한 예시는 가까이에 있다. 자주보고 익히자

### forEach, map 제네릭 분석

제네릭 사용에 대한 예시를 살펴보면서 분석해보자

```tsx
interface Array<T> {
  forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): void;
}
```

위 forEach 함수에 대한 타입 정의를 찾아보면 `lib.es5.d.ts`로 연결되고, 거기에서 찾은 forEach 타이핑은 위와 같음
위와 같이 제네릭으로 함수 타입이 정의되어 있기 때문에 아래와 같은 코드가 모두 가능해진다.

```tsx
const a: Array<number> = [1, 2, 3];
a.forEach((v) => console.log(v)); // v를 number로 알아서 추론

["1", "2", "3"].forEach((v) => console.log(v)); // v를 string로 알아서 추론
[true, false, true].forEach((v) => console.log(v)); // v를 boolean로 알아서 추론
[1, "2", true].forEach((v) => console.log(v)); // v를 number | string | boolean로 알아서 추론
```

[](4-2-ts-all-in-one-basic.md)
코드 작성 시에는 타입이 불분명한 상태에서 실제 사용 시 타입을 설정할 수 있어서 좋다.
근데 제네릭을 굳이 설정하지 않고 모두 타이핑을 해도 되지 않을까? [기본 문법 정리](4-2-ts-all-in-one-basic.md) 에서 논의했던 내용이므로 넘어감

다음, map도 알아보자.

```tsx
interface Array<T> {
  map<U>(callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: any): U[];
}

[1, 2, 3].map((v) => v.toString());
```

map 타입에 대해 가지고 왔다. 이해하는 과정을 따라가보자.

위 공식에서 T는 숫자 배열이므로 number가 됨

즉, `map<U>(callbackfn: (value: number, index: number, array: number[]) => U, thisArg?: any): U[];`

다음으로는 v.toString[]이 string 으로 값을 도출한다는 것을 의미하므로 U는 string 타입이 된다.

`map<string>(callbackfn: (value: number, index: number, array: number[]) => U, thisArg?: any): string[];`

위와 같은 과정으로 이해하면 제네릭도 충분히 이해할 수 있는 것임

![위 과정을 이해하면 stringArr 변수가 string[]로 추론되는 것을 이해할 수 있게된다.](../img/221220-1.png)

![](../img/221220-2.png)

## 기본 문법 정리

### 타입스크립트는 변수, 매개변수, 리턴값에 타입을 붙이는 것

타입스크립트는 기본적으로 아래의 타입을 제공한다.

```tsx
const a: string = "5";
const b: number = 5;
const c: boolean = true;
const d: undefined = undefined;
const e: null = null;
const f: symbol = Symbol.for("abc");
const g: bigint = 1000000n;
const h: any = "any";
const i: any = true;
```

타입스크립트의 최종적 목적은 any 타입을 사용하지 않는 것이다.
함수도 타이핑할 수 있다. 기본적인 포맷 참고

```tsx
function add(a: number, b: number): number {
  return a + b;
}

// 함수형은 타입을 아래 형식으로 적는다.
const add: (x: number, y: number) => number = (a, b) => a + b;
```

`(x: number, y: number) => number` 화살표 함수를 타이핑할 때 type alias를 사용할 수 있다.

```tsx
// 1. type alias 정의
type Add = (x: number, y: number) => number;

// 2. interface type 정의
interface Add {
  (x: number, y: number): number;
}

// 아래처럼 적용한다.
const add: Add = (a, b) => a + b;
```

객체도 아래와 같이 타입을 정의할 수 있다.

```tsx
const obj: { x: number; y: number } = { x: 1, y: 2 };
```

배열도 가능

```tsx
// 표현 방법 1
const arr: string[] = ["a", "b", "c"];

// 표현 방법 2
const arr2: Array<number> = [123, 456, 789];

// 표현 방법 3 - 길이가 고정되었을 때 튜플로 정의
const arr3: [number, number, string] = [1, 2, "3"];
const arr4: [number, number, string] = [1, 2, "3", 4]; // error, 소스에 4개 요소가 있지만, 대상에서 3개만 허용합니다.
```

바뀌지 않는 값은 정확하게 적어줄 수도 있다.

```tsx
const f: 5 = 5;
const g: 5 = 6; // error
```

### 타입 추론을 적극 활용하자

타입스크립트는 타입 추론을 제공한다.
따라서 무조건 타입을 선언하기 보다는 필요한 경우에만 타입을 넣어주는 것이 좋다.

```tsx
const a: number = 5;
```

위 변수 a는 `number` 타입으로 선언되었다. 하지만 a 변수는 const를 쓰므로 해당 값은 바뀌지 않는 불변의 데이터이다. 따라서 `number` 타입이라는 넓은 범위의 선언보다는 차라리 어떠한 타입도 정의하지 않는 것이 더 낫다.

```tsx
const a = 5;
```

위과 같이 정의 후 변수 a에 마우스를 올리면 타입스크립트가 알아서 a를 5라는 숫자로 추론한 것을 볼 수 있다.

![](../img/221208-1.png)

즉 위와 같은 타입 추론 방법이 number로 선언한 것보다 오히려 더 정확한 타입 선언이므로 때로는 타입 선언이 불필요할 수도 있다. 타입 추론에 맡겨도 되는 부분은 맡겨버리자

### js 변환 시 사라지는 부분을 파악할 것

typscript 코드는 Javascript 변환 시 모두 사라진다. 따라서 타이핑 영역을 정확히 파악해야한다.
먼저 기본적으로 `type`, `interface`, `generic`은 변환 시 모두 사라지는 코드이다.

또한 `body 없는 function 구조`의 함수 타입 정의도 사라진다. 아래 예시를 보자

```tsx
function add4(x: number, y: number): number; // type 정의

function add4(x, y) {
  // 실제 코드 작성
  return x + y;
}
```

위와 같이 할 경우 타입 정의를 한 type 정의 영역이 1번 라인은 js 변환 시 사라진다.
(단 tsconfig.json 설정이 !noImplicitAny && strictNullChecks여야 정상 동작함!!)
뿐만 아니라 `as` 키워드도 사라진다.

```tsx
let test = 123;
test = "hello" as unknown as number; // as는 타입을 강제로 변환
```

위 코드는 아래와 같이 변환됨

```jsx
let test = 123;
test = "hello";
```

위와 같은 제한은 JavaScript의 자유도를 매우 제한시키지만,
타입을 명확히 함으로써 예상하지 못한 버그를 초기에 잡을 수 있고, 예측 가능한 코딩을 할 수 있게되므로 실보다 득이 많다.

### never 타입과 느낌표(non-null assertion)

빈 배열을 타입 선언 없이 사용하게 되면 never라는 타입이 뜬다.
never에 대한 [좋은 설명은 이 글을 확인](https://ui.toast.com/posts/ko_20220323)하자.

![](../img/221209-1.png)

위와 같이 설정 후 값을 추가하면 타입이 정의되지 않은 never 타입의 배열이므로 에러가 발생한다.
즉, array 타입은 반드시 타입 정의를 아래와 같이 해야 함

```tsx
const array: string[] = [];
array.push("hello");
```

아래와 같이 특정 Element를 head 변수에 담았다고 하면 이 타입은 Element | null로 존재하지 않는 시점에 대한 타입까지 추론한다.

![](../img/221209-2.png)

위 상태에서 엘리먼트 내부에 hello라는 데이터를 주입하면 아래와 같이 에러가 발생한다.

![](../img/221209-3.png)

이 떄 해당 데이터가 반드시 있을거라는 의미로 느낌표를 사용한다.
그러면 엘리먼트가 `null`인 경우가 사라지므로 타입 에러가 발생하지 않는다.

![](../img/221209-4.png)

무조건 존재함을 보증하는 방식 = 느낌표. 그러나 이 방식은 비추임
세상에는 반드시, 무조건 적인 것은 존재하지 않으므로 웬만하면 사용하지 않는다. 대신 최대한 ! 대신 if를 사용하자

```tsx
const head = document.querySelector("#head");
if (head) {
  head.innerHTML = "hello";
  console.log(head);
}
```

위와 같이 head 엘리먼트가 존재하면 코드가 진행되도록 조건을 명확히 만들어주면 에러가 발생하지 않는다.
코드를 읽는 입장에서도 문제가 없으며 이후 예상하지 못했던 경우에 대해서도 모두 방어가 가능하므로 훨씬 바람직한 방법임

### 원시 래퍼 타입, 템플릿 리터럴 타입, rest, 튜플

string과 String 은 서로 다른 타입이다. String은 래퍼 개체. 아래 예시를 보자

```tsx
const aa: string = "hello";
const bb: String = "hell";

function cc(a1: string, b1: string) {}
cc(aa, bb); // bb에 Error 발생
```

위와 같이 bb 변수에 String 래퍼 타입을 넣을 경우 아래와 같은 에러 메시지가 반환된다.

![](../img/221211-1.png)

위에서 사용한 래퍼개체 String은 `new String()` 메서드 사용할 때 쓰는 String 타입이다.
거의 사용하지 않으므로 안쓴다고 생각하자.

또 타입 정의를 아래와 같이할 수도 있다.

```tsx
type World = "world";
const txt: World = "world";
```

![](../img/221211-2.png)

위 사용은 템플릿 리터럴 타입에서도 동일하게 적용할 수 있다.

```tsx
const txtB = `hello ${txt}`;
type Greeting = `hello ${World}`;
```

![](../img/221211-3.png)

위 예시는 실제 아래와 같은 방법으로 활용된다.

```tsx
type World = "world" | "hell";
type Greeting = `hello ${World}`;

const GreetingResult: Greeting = "";
```

![](../img/221211-4.png)

위와 같이 `GreetingResult` 변수에 `Greeting` 타입을 대입하면 타이핑에 의해 `hello hell` 과 `hello world`라는 값 두가지가 자동완성으로 제공된다.

위 Greeting 타입이 World type이 아닌 일반 string 이었다면 해당 자동완성은 제공되지 않았을 것임
더욱 명확한 타입을 제시할 수 있으므로 위와 같은 방법으로 템플릿 리터럴이 활용된다.

이 밖에 rest 문법은 아래와 같이 타이핑 할 수 있다.

```tsx
function rest(a, ...args: string[]) {
  console.log(a, args); // a = 1,  args = ["2", "3"]
}

rest(1, "2", "3");
```

또한 튜플 타이핑에 대해 알아보자

```tsx
const tuple: [string, number] = ["1", 1];

tuple[2] = "hello"; // Error
tuple.push("hello"); // Ok, 세번째 요소를 추가하므로 에러가 나야하지만 발생하지 않음
```

### enum, keyof, typeof

`enum` 타입에 대해 알아보자.

```tsx
// enum은 JavaScript 변환 시 사라진다.
const enum EDirection {
  Up = 3,
  Down,
  Left = "hello",
  Right = "vicky",
}

const e_up = EDirection.Up; // 3
const e_down = EDirection.Down; // 4
const e_left = EDirection.Left; // hello
const e_right = EDirection.Right; // vicky
```

위와 같이 데이터를 정의해서 쓸 수 있다. `enum`은 `javaScript` 변환 시 사라진다는 특징이 있다.
이를 보통 객체로 구현할 수 있는데, 아래와 같다.

```tsx
// object는 JavaScript 변환 시 유지된다.
const ODirection = {
  Up: 3,
  Down: 1,
  Left: "hello",
  Right: "vicky",
} as const;

const o_up = ODirection.Up; // 3
const o_down = ODirection.Down; // 4
const o_left = ODirection.Left; // hello
const o_right = ODirection.Right; // vicky
```

위 `enum`과 동일한 기능을 하지만 `object`로 정의한 변수 객체 값은 사라지지않고 보관된다는 특징이 있음
따라서 필요에 따라 남겨야할 경우와 값이 없어도 될 경우를 잘 나누어 사용하면 되겠다.

![](../img/221211-5.png)

이 밖에도 `enum`은 타입으로 사용할 수도 있다.

```tsx
function walk(dir: EDirection) {}
//  dir = 1 | 3 | "hello" | "vicky"

walk(EDirection.Up); // walk(3)
```

만약 `enum` 타입 사용이 어렵게 느껴진다면 객체 `ODirection` 으로도 타이핑을 할 수 있다.

```tsx
// It requires an extra line to pull out the keys
type Direction = typeof ODirection[keyof typeof ODirection];

// type Direction = 1 | 3 | "hello" | "vicky"
function run(dir: Direction) {}

run(ODirection.Up);
```

위 방법이 복잡하니 그냥 enum을 쓰게 된다 😄 이 참에 `keyof`에 대해 알아보자.

```tsx
const testObj = { a: "123", b: 123, c: true };
type Key = keyof typeof testObj; // type Key = "a" | "b" | "c"
```

만약 값을 type으로 모으고 싶다면 아래와 같이 한다.

```tsx
const testObj = { a: "123", b: 123, c: true } as const;
type Key = typeof testObj[keyof typeof testObj]; // type Key = true | 123 | "123"
```

`keyof typeof Object`는 key만 모아올 수 있고 `typeof Object[keyof typeof Object]`로 하면 value만 모을 수 있다.

### union(|)과 intersection(&)

type과 interface 모두 타입정의를 할 때 쓰인다.

```tsx
// type 정의
type A = { a: string };

// interface 정의
interface B {
  a: string;
}

const aaa: A = { a: "123" };
const bbb: B = { a: "123" };
```

interface는 객체지향 프로그래밍 즉, 복잡한 타이핑이 지원되어야할 때 사용한다. type은 간단한 타이핑 시 사용

이번에는 `union`을 알아본다. ‘또는’을 의미함

```tsx
type TypeUnion = string | number;
const txtUnion: TypeUnion = 123;

type TypeUnionObj = { hello: "world" } | { vicky: "choi" };
const unionObj1: TypeUnionObj = { hello: "world" };
const unionObj2: TypeUnionObj = { vicky: "choi" };
const unionObj3: TypeUnionObj = { hello: "world", vicky: "choi" };
```

string, number 중 하나의 타입으로 지정하거나 객체 값도 `TypeUnionObj` 처럼 설정할 수 있다. 여러 개 중 하나만 만족

```tsx
type TypeIntersectionObj = { hello: "world" } & { vicky: "choi" };
const intersectionObj1: TypeIntersectionObj = { hello: "world", vicky: "choi" };
const intersectionObj2: TypeIntersectionObj = { hello: "world" }; // Error
```

`Intersection(&)`은 ‘그리고’를 의미하므로 모든 속성이 모두 만족되어야 한다. 위 예시 참고하자

### type alias와 interface extends

타입은 아래와 같은 방법으로 상속된다.

```tsx
type Animal = { breath: true };
type Mamal = Animal & { breed: true };
type Human = Mamal & { think: true };

const vicky: Human = { breath: true, breed: true, think: true };
```

& 으로 상속을 구현함. interface 도 extends로 상속 구현이 가능하다.

```tsx
interface AnimalInterface {
  breath: true;
}

interface MamalInterface extends AnimalInterface {
  breed: true;
}

const baduc: MamalInterface = { breath: true, breed: true };
```

보통 타입은 간단한 타이핑 시 사용하고, interface는 좀 더 넓은 확장면에 있어서 유리하므로 필요에 따라 나눠 사용한다.
이 밖에도 interface의 extends 객체로 타입으로 선언한 코드를 넣을 수도 있다. 또한 type에 interface를 조합할 수 있다.

```tsx
interface MamalInterface extends Mamal {
  breed: true;
}

const baduc: MamalInterface = { breath: true, breed: true };
```

interface는 아래와 같은 오버라이딩 특징을 가진다.

```tsx
interface SameInterface {
  talk: () => void;
}
interface SameInterface {
  eat: () => void;
}
interface SameInterface {
  shit: () => void;
}

const same: SameInterface = {
  talk: () => {},
  eat: () => {},
  shit: () => {},
};
```

위 처럼 같은 명의 interface는 종국에는 하나의 SameInterface라는 타입으로 합쳐진다.
이러한 장점이 있어서 라이브러리를 사용할 때 Interface로 타입을 추가 확장하여 사용할 수 있다.

타입스크립트의 네이밍 룰에 대해 잠깐 알아본다.

```tsx
// 예전에는 I, T, E 등 대문자를 앞으로 붙였음
interface Iinterface {}
type Type = string | number;
enum EHello {
  Left,
  Right,
}

// 요즘은 no
interface Props {}
type Type = string | number;
enum Hello {
  Left,
  Right,
}

const a: Props = {};
```

기존에는 타입 정의를 할 때 interface, type, enum을 구분하기 위해 앞에 I, T, E 등의 키워드를 붙였다.
하지만 요즘은 잘 안씀. IDE 툴이 알아서 타입을 알려주므로 굳이 표시할 이유가 없음

![](../img/221213-1.png)

### 타입을 집합으로 생각하자(좁은 타입과 넓은 타입)

```
type A = string | number; // 넓은 타입
type B = string; // 좁은 타입
```

타입은 좁은 타입과 넓은 타입으로 나눌 수 있다. 좁은 타입은 넓은 타입에 적용이 가능하지만, 넓은 타입이 좁은 타입으로 할당하는 것은 불가능함. 비슷한 원리로 any는 전체집합, never는 공집합으로 볼 수 있다.

```tsx
type A = string | number; // 상대적으로 넓은 타입
type B = string; // 상대적으로 좁은 타입
type AB = A | B; // A와 B를 '또는' 으로 연결하므로 넓은 타입

type objA = { name: string }; // 속성이 좁을수록 넓은 타입
type objB = { age: number }; // 속성이 좁을수록 넓은 타입

type objC = { name: string; age: number }; // 속성이 구체적일수록 좁은 타입
```

위와 같은 타입의 성질을 활용하면 아래의 타이핑이 구현할 수 있다.

```tsx
type objA = { name: string };
type objB = { age: number };

type objAB = objA | objB;
type objC = objA & objB;

const ab: objAB = { name: "vicky" };
const c: objC = { name: "vicky", age: 33 };
```

`또는`과 `그리고` 로 만들어진 타입을 적용한 것이다. 위 타입은 아래와 같이 대입할 수 있다.

```tsx
const c: objC = { name: "vicky", age: 33 };
const ab: objAB = { name: "vicky" };

const ab: objAB = c;
```

`objC` 타입 (좁은 타입) → `objAB`(넓은 타입)이므로 타입 적용이 가능함
하지만 아래의 경우에는 문제가 있다.

```tsx
const ab: objAB = { name: "vicky" };
const c: objC = { name: "vicky", age: 33 };

const c: objC = ab;
```

![](../img/221214-1.png)

objC타입이 좁은 타입이므로 여기에 넓은 타입을 적용할 수 없다.
그렇다면 아래와 같이 좁은 타입 속성을 할당한 c에 `married`라는 데이터를 추가한다고 해보자

```tsx
const c: objC = { name: "vicky", age: 33, married: false }; // 잉여 속성 검사에 따라 Error
```

위 코드는 잉여 속성 검사에 따라 Type Error가 발생한다.

![](../img/221214-2.png)

실제 대입한 값이 { name: "vicky", age: 33, married: false } 로 objC가 더 넓은 타입에 속하기 때문에 문제가 없어야 하지만 추가적인 속성 검사에 따른 에러가 발생하는 것임. 이는 아래와 같이 값을 따로 빼주면 에러가 발생하지 않는다.

```tsx
const obj = { name: "vicky", age: 33, married: false };
const c: objC = obj; // Ok
```

위와 같이 객체 리터럴에 바로 값을 대입하는 것은 에러를 발생시킬 수 있다는 점 알아두자.

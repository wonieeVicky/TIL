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

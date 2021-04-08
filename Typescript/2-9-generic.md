# 제네릭

제네릭은 C#, Java 등의 언어에서 재사용성이 높은 컴포넌트를 만들 때 자주 활용되는 특징이다.  
특히, 한가지 타입보다 여러가지 타입에서 동작하는 컴포넌트를 생성하는데 사용된다.

## 제네릭의 기본 문법

만약 아래와 같은 함수가 있다고 했을 때 자바스크립트는 파라미터에 다양한 타입의 인자값을 받을 수 있다.  
별도의 타입선언이 없으므로 암묵적으로 모든 타입을 다 받을 수 있도록 설정되었기 때문이다.

```jsx
function logText(text) {
  return text;
}
logText("hi"); // string hi
logText(20); // number 20
logText(false); // boolean
```

위의 함수를 타입스크립트의 제네릭으로 표현하면 아래와 같은데,  
제네릭은 기본적으로 함수를 호출할 때 파라미터에 대한 타입을 동적으로 지정하는 것을 의미한다.

```tsx
function logText<T>(text: T): T {
  console.log(text);
  return text;
}

logText<string>("text"); // 문자열 타입을 넘겨주어 hi 가능
logText<number>(1990); // number 타입을 넘겨주어 1990 가능
```

이러한 제네릭 문법은 언제 사용되어지고 왜 쓰는 것일까?

## 기존 타입 정의 방식과 제네릭의 차이점 - 함수 중복 선언의 단점

바로 중복된 타입을 생성해야하는 불편함 때문에 제네릭을 사용한다.

```tsx
function logText(text: string) {
  return text;
}
logText("hi"); // string hi
logText(20); // Type error
logText(false); // Type error!
```

위와 같이 logText의 인자값 안에 타입체크를 위해 string으로 설정을 하면, 선언을 아래 logText 호출부분에서 boolean값과 number 인자를 넣은 호출부에서는 에러가 발생한다. 옳지 않은 타입이기 때문.

따라서, 만약 number형에 대한 것을 추가하려면 아래와 같이 logNumber 함수로 비슷한 역할을 하는 Number 타입을 위한 함수를 생성해야 한다. 이렇게 타입 체크를 위해 중복되는 코드를 비생산적인 방식으로 추가해나가는 방식은 코드의 가독성, 코드의 비대성 측면, 유지보수 측면에서 좋은 방법이 아니다.

```tsx
function logText(text: string) {
  text.split("").reverse().join("");
  return text;
}
function logNumber(num: number) {
  return num;
}
logText("hi"); // string hi
logNumber(20); // number 20
logText(false); // Type error!
```

## 기존 타입 정의 방식과 제네릭의 차이점 - 유니온 타입 방식의 문제점

그렇다면 지난 시간에 배운 유니온 타입`|`으로 설정하며 되지 않을까? 바로 아래와 같이 말이다.

```tsx
function logText(text: string | number) {
  console.log(text);
  // 1. 인자 값에 대한 코드를 작성 시 문제 발생
  return text;
}
const a = logText("vicky"); // 2. 변수에 값을 담아 사용할 때도 문제 발생
a.split(""); // Type error!
```

문제는 두 가지가 있다.

1. 먼저 함수 내부에서 text 인자에 접근할 수 있는 메서드가 IDE에서 제공하는 자동완성 기능에서 string과 number 타입에 공통으로 사용 가능한 타입만 지원이 된다. string과 number 중 어떤 타입이 들어올지 모르기 때문이다.
2. 이는 해당 정보에 대한 리턴 값을 변수에 담아 사용할 때도 동일하게 적용된다. 아래와 같이 `a.split('');` 이라는 코드를 적으면 타입 에러를 발생시키는데 이는 a의 인자가 string | number로 설정되어 문자 타입에서 사용할 수 있는 메서드 사용을 금지하기 때문임.

이러한 문제가 있으므로 우리는 제네릭 타입을 통해 파라미터에 전달되는 인자값에 대한 타입 체크를 동적으로 처리해준다. 그럼 제네릭의 장점에 대해 더 살펴보자

## 제네릭의 장점과 타입 추론에서의 이점

위의 logText 함수에 대해 다시한번 제네릭 타입을 적용하면 아래와 같다.

```tsx
// 1
function logText<T>(text: T): T {
  console.log(text);
  return text;
}
const str = logText<string>("vicky"); // 2
str.split(""); // 3

const login = logText<boolean>(true); // 4
```

1. logText 함수의 인자값으로 `<T>`라는 유형을 쓰겠다라고 지정하고 해당 `T` 타입을 파라미터 값에 적용해준다. 그리고 반환값도 동일하게 가져갈 경우 반환 타입 설정 부분에도 `T`를 지정해준다.
2. 이후 logText 함수를 호출할 때 파라미터 타입을 `<string>`으로 지정하면 파라미터의 타입이 string으로 동적으로 지정된다.
3. 위의 지정에 따라 str 변수에 string 메서드들이 자동 완성으로 지원되며 타입 에러도 발생하지 않는다.
4. <boolean>, <number>등으로 다양하게 타입을 설정해나갈 수 있다.

## 제네릭 실전 예제 살펴보기 - 예제 설명

email, numberOfProducts라는 두 가지 객체를 사용해서 드롭다운 DOM을 주입해주는 공통의 함수를 만들어 사용한다고 가정해보자. 우선 JavaScript로는 아래와 같이 구현할 수 있다.

```jsx
// email Object
const emails = [
  { value: "naver.com", selected: true },
  { value: "gmail.com", selected: false },
  { value: "hanmail.net", selected: false },
];
// products Object
const numberOfProducts = [
  { value: 1, selected: true },
  { value: 2, selected: false },
  { value: 3, selected: false },
];

// function Create Dropdown Item
function createDropdownItem(item) {
  const option = document.createElement("option");
  option.value = item.value.toString();
  option.innerText = item.value.toString();
  option.selected = item.selected;
  return option;
}

// 이메일 드롭 다운 아이템 추가
emails.forEach(function (email) {
  const item = createDropdownItem(email);
  const selectTag = document.querySelector("#email-dropdown");
  selectTag.appendChild(item);
});
// 상품 드롭 다운 아이템 추가
numberOfProducts.forEach(function (product) {
  const item = createDropdownItem(product);
  const selectTag = document.querySelector("#product-dropdown");
  selectTag.appendChild(item);
});
```

위 함수에서보면 `createDropdownItem`라는 함수로 email이라는 객체와 numberOfProducts라는 객체의 드롭다운을 모두 생성해주고 있다. 이럴 때 item이라는 매게변수 인자에 대한 타입 정의를 어떻게 하면 좋을까?

### 1. 유니온을 사용한 타입 지정

```tsx
// Email이라는 인터페이스 생성
interface Email {
  value: string;
  selected: boolean;
}
// ProductNumber라는 인터페이스 생성
interface ProductNumber {
  value: number;
  selected: boolean;
}

// Email 인터페이스 타입 지정
const emails: Email[] = [
  { value: "naver.com", selected: true },
  { value: "gmail.com", selected: false },
  { value: "hanmail.net", selected: false },
];
// ProductNumber 인터페이스 타입 지정
const numberOfProducts: ProductNumber[] = [
  { value: 1, selected: true },
  { value: 2, selected: false },
  { value: 3, selected: false },
];

// Email, ProductNumber 타입을 유니온 타입으로 지정
function createDropdownItem(item: Email | ProductNumber) {
  // 생략
  return option;
}

emails.forEach(function (email) {
  const item = createDropdownItem(email); // ok
  // 생략
});
numberOfProducts.forEach((product) => {
  const item = createDropdownItem(product); // ok
  // 생략
});
```

위와 같이 각 email과 numberOfProducts 객체에 대한 타입을 직접 인터페이스로 지정한 뒤 해당 타입을 createDropdownItem 함수에 유니온 타입으로 지정해주면 실제 함수 호출부에서 타입 에러가 발생하지 않는다. 하지만 여기서 단점은 무엇일까? 다른 종류의 객체가 생기고 해당 함수를 동일하게 사용해서 실행할 경우 새로 생긴 객체에 대한 타입을 또 interface 타입으로 지정하여 유니온을 사용해 함수 매개변수에 적용해줘야한다는 것이다.

```tsx
// 각 객체별 데이터 값을 따로따로 지정해줘야하는 불편함이 있음
function createDropdownItem(item: Email | ProductNumber | Animal | Jewelry | Country) {
  // 생략
  return option;
}
```

위와같이 모든 타입에 대한 정의를 해주면 그만큼 코드량이 많아지고 복잡해지므로 이럴 때 제네릭을 사용하면 매우 유용하다~!

### 덧, 인터페이스에 제네릭을 선언하는 방법

위 코드에 제네릭을 적용하기 전에 `인터페이스에 제네릭을 선언하는 방법`을 배워보자.  
기존에 interface에 타입 지정은 아래와 같이 할 수 있었다.

```tsx
interface Dropdown {
  value: string;
  selected: boolean;
}

const obj1: Dropdown = {
  value: "vicky", // Ok!
  selected: false,
};
const obj2: Dropdown = {
  value: 10, // Type Error!
  selected: false,
};
```

위와 같을 경우 obj2의 value 값에서 타입 에러가 발생한다. value가 string 타입으로 정해져있기 때문. 이걸 제네릭을 적용해서 동적으로 타입이 할당되도록 바꾸면 아래와 같다.

```tsx
interface Dropdown<T> {
  value: T;
  selected: boolean;
}
const obj1: Dropdown<string> = { value: "vicky", selected: false };
const obj2: Dropdown<number> = { value: 1990, selected: false };
```

위와같이 interface에 제네릭을 적용하면 얼마든지 다양하게 타입을 지정할 수 있다.

### 2. 제네릭을 이용한 타입 정의

```tsx
// 1. 대표 인터페이스를 제네릭을 사용해 타입 지정
interface DropdownItem<T> {
  value: T;
  selected: boolean;
}

// 2. string을 DropdownItem의 타입으로 할당
const emails: DropdownItem<string>[] = [
  { value: "naver.com", selected: true },
  { value: "gmail.com", selected: false },
  { value: "hanmail.net", selected: false },
];

// 2. number를 DropdownItem의 타입으로 할당
const numberOfProducts: DropdownItem<number>[] = [
  { value: 1, selected: true },
  { value: 2, selected: false },
  { value: 3, selected: false },
];

// 3. 함수 호출 시에도 제네릭을 이용해 매개변수 타입을 동적으로 받아올 수 있다.
function createDropdownItem<T>(item: DropdownItem<T>) {
  const option = document.createElement("option");
  option.value = item.value.toString();
  option.innerText = item.value.toString();
  option.selected = item.selected;
  return option;
}

emails.forEach(function (email) {
  const item = createDropdownItem<string>(email); // 4. 함수 호출 시 제네릭으로 타입 지정
  // 생략
});

numberOfProducts.forEach((product) => {
  const item = createDropdownItem<number>(product); // 4. 함수 호출 시 제네릭으로 타입 지정
  // 생략
});
```

1. `DropdownItem` 인터페이스를 지정하고 제네릭을 사용해 동적으로 타입이 할당될 수 있도록 해주었다.
2. 각 배열객체에 `DropdownItem` 인터페이스를 적용해주고 해당 데이터에 맞는 타입을 T에 지정해준다.
3. 제네릭을 이용하면 함수 호출 시 매개변수 타입을 동적으로 받아올 수 있다.
4. 함수 호출 시 제네릭을 사용해 매개변수에 전달될 타입을 동적으로 설정해주었다.

## 제네릭의 타입 제한

위와 같이 제네릭의 기본 사용법을 예제를 통해 확인해보았다. 그렇다면 기본 사용법에서 나아가 제네릭을 엄격하게 사용하거나 더 많은 옵션을 주기 위한 타입 제한 방법에 대해 알아보자.

```tsx
function logTextLength<T>(text: T): T {
  console.log(text.length); // Type Error! text가 뭐가 들어올지 알 수가 없음
  return text;
}
logTextLength<string>("안녕");
```

위와 같이 로깅을 하는 함수 logTextLength에 제네릭을 사용해 타입을 동적으로 할당한다고 했을 때 해당 함수 내부의 `console.log(text.length);` 에서 타입 에러가 발생한다. 왜냐하면 해당 함수가 문자열이 들어올지 숫자가 들어올지 타입스크립트 입장에서는 알 수 없기 때문이다.

따라서 이런 경우 아래와 같이 제네릭 T의 타입이 배열([])로 들어올 것이라는 추론을 추가해줌으로서 length나 forEach 등의 메서드가 사용 가능해지도록 설정해줄 수 있다.

```tsx
function logTextLength<T>(text: T[]): T[] {
  console.log(text.length);
  text.forEach((text) => console.log(text));
  return text;
}
logTextLength<string>(["안녕"]);
```

단, 이렇게 되면 함수 호출부에서 string이 아닌 문자배열 형태의 인자를 넘겨야한다..ㅎ

위 예제를 통해 말하고자 하는 바는 함수 안에서 실행되는 로직 내부에 특정 타입에만 사용할 수 있는 메서드를 사용한다면 제네릭을 사용했을 시 타입에러가 발생하므로 해당 데이터가 특정 타입을 사용할 수 있도록 타입제한을 추가함으로서 범용성을 늘려줄 수 있다는 점이다. 참고할 것!

## 정의된 타입으로 타입을 제한하기

위 타입제한 방법에서 나아가 이미 정의된 타입을 사용하여 타입을 제한할 수도 있다.

```tsx
interface LengthType {
  length: number;
}
// 1. extends로 제네릭 T에 정의된 타입을 추가해준다.
function logTextLength<T extends LengthType>(text: T): T {
  text.length;
  return text;
}
logTextLength("a"); // 2. Ok
logTextLength(10); // 3. Type error!
logTextLength({ length: 10 }); // 4. extends 타입인 LengthType 사용
```

1. extends를 사용해 제네릭 T의 타입에 이미 정의된 타입 LengthType을 넣어 확장해준다.
2. 문자열은 잘 적용된다. 왜? string 자체가 length 메서드가 지원되기 때문임!
3. 그러나 Number는 타입 에러가 발생한다. number 는 length 메서드가 지원되지 않으므로..
4. 따라서 number 타입을 부여하고 싶을 때는 LengthType에서 지정한 대로 객체 형태로 인자에 전달해주면 에러가 발생하지 않는당 !!

위와 같이 이미 선언해둔 타입을 extends 메서드로 확장하여 사용하는 방법을 알아봤다.  
extends는 많이 쓰이므로 잘 기억해둘 것

## keyof로 제네릭의 타입 제한하기

`keyof` 메서드를 사용해 제네릭의 타입을 제한할 수 있다. `keyof` 라는 단어의 문맥 상
"해당 키를 가졌을때"로 이해하면 좋다.

```tsx
interface ShoppingItem {
  name: string;
  price: number;
  stock: number;
}

// 1. keyof를 통해 ShoppingItem에 대한 key를 타입으로 지정해준다.
function getShoppingItemOption<T extends keyof ShoppingItem>(itemOption: T): T {
  return itemOption;
}

getShoppintItemOption(1); // Type error!!
getShoppingItemOption("name"); // 2. Ok
getShoppingItemOption("price"); // 2. Ok
```

1. `extends keyof`를 사용해 인터페이스 타입을 지정해주면 `ShoppingItem`에 있는 key 데이터 중 한가지가 T의 제네릭으로 추가된다. 이는 곧 인자에 name, price, stock만 올 수 있음을 의미한다.
2. 인자에 받을 타입을 결정하는 느낌인데, 함수 호출 시 어떤 인자를 넣을 수 있을지 궁금하다면 ctrl+space를 눌러 IDE의 자동완성 탭에서 확인되는 인자값을 보면 쉽게 알 수 있음

위와 같이 제네릭과 함께 사용하는 여러가지 타입 제한 방법에 대해 알아보았다. 제네릭은 정~말 많이 쓰이는 타입 지정 방법이니 여러번 보고 실무에 적용해보도록 해야겠다~!

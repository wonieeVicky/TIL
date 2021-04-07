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

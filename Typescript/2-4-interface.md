# interface

## 변수를 정의하는 인터페이스

인터페이스는 반복되는 타입들에 대해 하나의 인터페이스를 정의하고 이 정의를 가져다 쓰도록 할 수 있다.

```tsx
interface User {
  age: number;
  name: string;
}

var vicky: User = {
  age: 32,
  name: 'vicky',
};
```

변수 vicky에 User 인터페이스 타입이 정의되었다.

## 함수의 인자를 정의하는 인터페이스

함수의 인자에 인터페이스 정의를 활용할 수 있다. 이렇게 타입을 지정해주면 실제 함수 호출 시에 정확한 데이터가 인자로 전달되었는지 타입스크립트가 체크해주므로 매우 유용하다. 해당 방식은 타입스크립트 사용 시 제일 많이 사용되어지는 유형이므로 한번 더 복기할 것

```tsx
interface User {
  age: number;
  name: string;
}

function getUser(user: User) {
  console.log(user);
}

getUser(11); // eslint error
getUser({ name: 'wonny' }); // eslint error
getUser({ name: 'wonny', age: 32 }); // ok
```

## 함수 구조를 정의하는 인터페이스

인터페이스는 함수의 구조를 정의할 수도 있다.  
라이브러리를 만들거나 여러 사람들과의 협업 시 함수의 규칙을 정하는 단계에서 이 방법을 많이 사용한다.

```tsx
interface SumFunction {
  (a: number, b: number): number;
}

var sum: SumFunction;
sum = function (a: number, b: number): number {
  return a + b;
};
```

## 인덱싱 방식을 정의하는 인터페이스

인터페이스로 인덱싱 방식을 정의할 수도 있다.

```tsx
interface StringArray {
  [index: number]: string;
}
var arr: StringArray = ['a', 'b', 'c'];
arr[0] = 10; // type Error
arr[0] = 'go!'; // ok
```

## 인터페이스 딕셔너리(Dictionary) 패턴

인터페이스로 딕셔너리 패턴을 구현할 수 있다.
아래 예시를 보면 css, js 등의 파일에 대한 확장자 체크를 사전의 구조로 담고 있는 타입패턴을 의미하는 것 같다.

```tsx
interface StringRegexDictionary {
  [key: string]: RegExp;
}

var obj: StringRegexDictionary = {
  cssFile: /\.css$/,
  jsFile: /\.js$/,
};
obj['cssFile'] = 'a'; // string 형식은 RegExp에 할당할 수 없음
Object.keys(obj).forEach((value) => {}); // value 값을 string으로 추론해준다.
```

## 인터페이스 확장(상속)

확장 혹은 상속이라는 개념은 OOP 혹은 자바스크립트의 프로토타입 등에서 사용되어지는 개념으로, 인터페이스를 상속받아 기존의 구조보다 더 확장해서 사용할 수 있는 구조를 의미한다.

```tsx
interface Person {
  name: string;
  age: number;
}

// Person의 인터페이스 정의를 상속받는다.
interface Developer extends Person {
  language: string;
}

var test: Developer = {
  language: 'react',
}; // error

var wonny: Developer = {
  language: 'javascript',
  name: 'vicky',
  age: 32,
}; // ok
```

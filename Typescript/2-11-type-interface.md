# 타입 추론(Type Inference)

타입스크립트가 타입을 추론 해나가는 과정은 다음과 같다.

```tsx
let x = 3;

function getB(b = 10) {
  const c = '10';
  return b + c; // 1010
}
```

위와 같이 `x`에 대한 타입을 따로 지정하지 않더라도 일단 `x`는 `number`로 간주되는데, 이렇게 변수를 선언하거나 초기화할 때 타입이 추론된다. 이외에도 변수, 속성, 인자의 기본 값, 함수의 반환 값 등을 설정할 때 타입 추론이 일어난다.

또한, `getB`라는 함수에서 인자 값 `b`에 초기값으로 10이라는 데이터를 넣으면 `b`의 타입은 `number`로 간주되는데, 이 또한 타입 추론으로 인해 발생하는 것을 알 수 있다. 그리고 함수 내부에서 `string` 변수값 `c`를 선언 후 반환 시 `number` 타입인 `b`와 `string` 타입인 `c`를 조합하여 반환해주면 해당 함수의 리턴값은 `string`으로 타입추론되는 것을 알 수 있다. (자바스크립트에서 '10'+10 = 1010이므로)

## 인터페이스와 제네릭을 이용한 타입 추론 방식

변수, 함수에 대한 타입 추론에서 나아가 인터페이스와 제네릭을 이용해서도 타입 추론이 가능하다.

```tsx
// Dropdown이라는 인터페이스 타입을 제네릭으로 이용해 지정한 뒤
interface Dropdown<T> {
  value: T;
  title: string;
}
// shoppingItem 변수에 string 값을 부여한 Dropdown 타입을 반환값으로 지정
var shoppingItem: Dropdown<string> = {
  value: 'vicky',
  title: '아우터',
};
```

위처럼 인터페이스와 제네릭을 이용한 타입을 사용하여 shoppingItem이라는 변수에 제네릭 타입을 string으로 설정한 Dropdown 타입을 반환값으로 주면 value 값에 대한 타입이 string으로 자동 타입 추론됨을 알 수 있다. 이처럼 인터페이스와 제네릭을 사용한 타입에서도 추론은 가능하다.

## 복잡한 구조에서의 타입 추론 방식

두가지 인터페이스를 상속받아 사용한 경우에도 타입 추론은 동작한다. 아래 예시 코드를 보자.

```tsx
interface Dropdown<T> {
  value: T;
  title: string;
}
// 1
interface DetailedDropdown<K> extends Dropdown<K> {
  description: string;
  tag: K;
}

var detailedItem: DetailedDropdown<string> = {
  title: 'abc',
  description: 'desc',
  value: 'items',
  tag: 'good',
};
```

1. DetailedDropdown이라는 인터페이스 타입에 `Dropdown` 타입을 확장자로 주어 상속을 발생시키면 `description`, `tag` 뿐만 아니라 `value`와 `title`에 대한 데이터도 모두 받을 수 있다. 이때 제네릭 타입 값을 동일한 `K`값으로 주면 `value`와 `tag`의 타입이 동일한 타입 `K`로 지정된다!
   예를 들어 `detailedItem`이라는 변수에 `string` 값을 제네릭으로 설정한 DetailedDropdown 변수를 반환 타입으로 지정해주면 `value`와 `tag` 값에는 모두 `string`으로 타입 추론된다. 만약 DetailedDropdown를 number로 제네릭 타입을 설정하면 `value`와 `tag` 값 모두 `number`로 타입 추론된다.

이 모든 타입 추론은 모두 TypeScript Language Server에 의해 동작하는 것이다.

## 가장 적절한 타입(Best Common Type) 추론 방식

타입은 보통 몇 개의 표현식을 바탕으로 타입을 추론한다. 그리고 그 표현식을 이용해 가장 근접한 타입을 추론하게 되는데 이 가장 근접한 타입을 Best Common Type이라고 한다. (타입스크립트의 알고리즘)

```tsx
var arr = [1, 2, true]; // number | boolean 으로 타입 추론
var arr2 = [1, 2, true, 'a']; // number | boolean | string으로 타입 추론
```

타입스크립트는 배열에 대한 타입을 추론하기 위해 배열의 각 아이템을 살펴보는데, 배열의 각 아이템은 각 number, boolean, string으로 구분되므로 타입스크립트는 Best Common Type 알고리즘으로 다른 타입들과 가장 잘 호환되는 타입을 선정한다. (모든 값을 유니온 값으로 묶어나가는 형태이다!)

## TypeScript Language Server

타입스크립트 추론이 가능한 이유는 TypeScript Language Server 덕분이다. 사용하는 IDE인 VScode에서는 자체적으로 TypeScript Language Server가 구축되어 있어서 타입 체크가 가능하다. 또한 우리가 프로젝트를 진행함에 있어서 TypeScript에 대한 타입 체크 등이 가능한 것은 package.json에서 TypeScript 라이브러리를 설치해줬기 때문이다.

따라서 프로젝트 내부의 node_modules 폴더에 Typescript 폴더로 가면 bin 폴더에 tsc와 tsserver라는 동작 폴더가 있는 것을 볼 수 있음. 타입스크립트를 설정하면 해당 기능을 모두 사용할 수 있고, 이를 통해 타입 추론이 가능하다는 것을 깨닫고 넘어가면 좋겠다 : )

---

### TypeScript Language Server 관련 참고 문서

- [VSCode 타입스크립트 소개 문서](https://code.visualstudio.com/docs/languages/typescript#_code-suggestions)
- [VSCode Language Server Extension 가이드](https://code.visualstudio.com/api/language-extensions/language-server-extension-guide)
- [Language Server 소개 사이트](https://langserver.org/)
- [Language Server Protocol 개요](https://docs.microsoft.com/ko-kr/visualstudio/extensibility/language-server-protocol?view=vs-2019)

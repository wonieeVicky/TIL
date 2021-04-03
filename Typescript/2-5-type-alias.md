# 타입 별칭

## 타입 별칭 소개 (Type Aliases)

타입 별칭은 특정 타입이나 인터페이스를 참조할 수 있는 타입 변수를 의미한다.

```tsx
// string 타입을 사용할 떄
const name: string = 'vicky';

// 타입 별칭을 사용할 때
type MyName = string;
const name: MyName = 'vicky';

type Todo = { id: number; name: string; done: boolean };
function getTodo(todo: Todo) {
  /* ... */
}
```

interface 레벨의 복잡한 타입에도 아래와 같이 별칭을 부여할 수 있다.

```tsx
type Developer = {
  name: string;
  skill: string;
};
```

타입 별칭에 제네릭도 사용 가능

```tsx
type User<T> = {
  name: T;
};
```

## 타입 별칭과 인터페이스의 차이점

타입 별칭은 새로운 타입 값을 하나 생성하는 것이 아니라 정의한 타입에 대해 나중에 쉽게 참고할 수 있게 이름을 부여하는 것과 같다. 이러한 특징은 Vscode 상의 프리뷰 상태로 다른 타입과 어떤 차이점이 있는지 쉽게 확인할 수 있음

아래는 인터페이스로 선언한 타입을 프리뷰로 확인한 결과 → Person에 접근 시 아래와 같이 뜬다.

```tsx
interface Developer {
  name: string;
  skill: string;
}

var vicky: Person; // interface Person
```

아래는 타입 별칭으로 선언한 타입을 프리뷰로 확인한 결과이다.

```tsx
type Developer {
  name: string;
  skill: string;
}

var vicky: Person; // type Developer = { name: string; skill: string; }
```

### type vs interface

IDE에서 빠르게 type을 확인할 수 있으니 이걸 사용해야하는게 아닐까? 단점이 있다. 확장(상속)이 안됨.

타입 별칭과 인터페이스의 가장 큰 차이점은 타입의 확장 가능 / 불가능 여부이다. 인터페이스는 확장이 가능한데 반해 타입 별칭은 확장이 불가능하다. 따라서 **가능한 type 보다는 interface로 선언해서 사용하는 것이 좋다**. (좋은 소프트웨어는 언제나 확장이 용이해야 한다는 원칙에 따라 가급적 확장 가능한 인터페이스로 선언하면 좋다.)

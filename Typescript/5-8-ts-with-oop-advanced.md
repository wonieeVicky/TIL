## 타입스크립트의 막강한 타입

TypeScript에는 Conditional Types, Mapped Types, Utility Types 등의 타입 시스템을 지원한다.

### Type Alias와 Interface 뭘 써야 할까? (기술적인 측면)

이번에는 Type Alias와 interface의 차이점에 대해 알아보자

위 두 개는 성격과 그 특징이 모두 다름. 정확하게 어떻게 다른지 사용 방법에 대해 알고 시작하는 것이 좋다.

```tsx
type PositionType = {
  x: number;
  y: number;
};

interface PositionInterface {
  x: number;
  y: number;
}
```

위 두가지 Type, Interface는 굉장히 동일한 것을 묘사하고 있다.
이는 아래와 같이 object에 적용시킬 수 있다.

```tsx
// object ★
const obj1: PositionType = {
  x: 1,
  y: 2
};
const obj2: PositionInterface = {
  x: 4,
  y: 5
};
```

그리고 class로도 구현할 수 있음

```tsx
// class ★
class Pos1 implements PositionType {
  x: number;
  y: number;
}
class Pos2 implements PositionInterface {
  x: number;
  y: number;
}
```

type, interface 둘 다 사용할 수 있음. 또한 타입의 확장(extends) 도 가능하다.

```tsx
// Type, interface의 확장 Extends
interface ZPositionInterface extends PositionInterface {
  z: number;
}
type ZPositionType = PositionType & { z: number };
```

둘 다 굉장히 비슷함. 초기에는 Type에 대한 확장이 불가능했으나 이제 가능해졌다.

그렇다면 어떤 차이점이 있을까? interface 만 결합이 가능하다는 차이점이 있다.

```tsx
interface PositionInterface {
  x: number;
  y: number;
}
// only interfaces can be merged.
interface PositionInterface {
  z: number;
}

// 인터페이스 타입 결합 - x, y, z 값이 모두 존재해야 함
const obj12: PositionInterface = {
  x: 4,
  y: 5,
  z: 1
};
```

위와 같이 동일한 interface를 선언하게 되면 타입이 자동 결합되어 사용할 수 있게 된다.

```tsx
// Type aliases can use computed properties
type Person = {
  name: string;
  age: number;
};
type Name = Person['name']; // string type
type NumberType = number; // type만 쓸 수 있는 특징
type Direction = 'left' | 'right'; // union type
```

Type Alias의 경우에는 그 속성 타입을 추출해서 사용할 수 있고(Name 타입 참고)
type을 명확히 지정해서 사용하거나, Union type으로 사용하는 것은 타입만이 가능함

위 특징을 제대로 이해하고 넘어가는 것이 중요하다.

### Type Alias와 Interface 뭘 써야 할까? (개념적 측면)

Type과 Interface의 정의를 한번 더 짚어보자

- Interface : 규격사항. 객체 간 의사소통 시 정해진 인터페이스를 토대로 서로 소통하도록 약속, 계약한 정보, 기능을 구현 시 해당 규격사항의 정보를 나열한 것

  ```tsx
  interface CoffeeMaker {
    coffeeBeans: number;
    makeCoffee: (shots: number) => Coffee;
  }

  class CoffeeMachine implements CoffeeMaker {
    coffeeBeans: number;
    makeCoffee(shots: number) {
      return {};
    }
  }
  ```

  - ex) 이 클래스는 이 인터페이스를 구현한다.

- Type : 데이터를 담을 때 그 데이터의 타입을 의미함

  ```tsx
  type Position = {
    x: number;
    y: number;
  };

  const pos: Position = { x: 0, y: 0 };
  printPosition(pos);
  ```

  - ex) 이 컴포넌트에 전달할 수 있는 Props 타입은 이 타입이다.

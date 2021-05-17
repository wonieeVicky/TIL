## 유틸리티 타입이란?

우리가 흔히 제네릭(Generic) 타입으로 잘 알고있는 유틸리티 타입은 **이미 정의해 놓은 타입을 변환할 때 사용하기 좋은 타입 문법**이다. 유틸리티 타입을 꼭 쓰지 않더라도 기존의 인터페이스, 제네릭 등의 기본 문법으로 충분히 타입을 변환할 수 있지만 유틸리티 타입을 스면 훨씬 더 간결한 문법으로 타입을 정의할 수 있다. API 성 타입

## 자주 사용되는 유틸리티 타입 알아보기

### Partial

파셜(Partial) 타입은 **특정 타입의 부분 집합을 만족하는 타입을 정의**할 수 있다.

```tsx
interface Address {
  email: string;
  address: string;
}

type MayHaveEmail = Partial<Address>;
const me: MayHaveEmail = {}; // 가능
const you: MayHaveEmail = { email: "hwfongfing@gmail.com" }; // 가능
const all: MayHaveEmail = { email: "hwfongfing@gmail.com", address: "Dongtan" }; // 가능
```

### Pick

픽(Pick) 타입은 특정 타입에서 몇 개의 속성을 선택(pick)하여 타입의 정의할 수 있는 유틸리티 타입이다. 불필요한 타입 코드들이 줄어들며, 간결하게 타이핑 유지 가능하다.

```tsx
interface Product {
  id: number;
  name: string;
  price: number;
  brand: string;
  stock: number;
}

// Pick 유틸리티 타입으로 필요하 속성만 선택
type ShoppingItem = Pick<Product, "id" | "name" | "price">;

// 상품의 상세정보 조회
function displayProductDetail(shoppingItem: ShoppingItem) {}
```

```tsx
interface Hero {
  name: string;
  skill: string;
}

const human: Pick<Hero, "name"> = {
  name: "스킬이 없는 사람",
};
```

```tsx
type HasThan<T> = Pick<Promise<T>, "then" | "catch">;
let hasThen: HasThan<number> = Promise.resolve(4);
hasThen.th; // 위에서 then만사용하면 'then'만 제공, 'catch' 선택하면 'catch만 제공'
```

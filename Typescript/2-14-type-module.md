# 타입 모듈화

타입스크립트에서 가리키는 모듈은 ES6의 모듈 개념과 유사하다. 모듈은 전역 변수와 구분되는 자체 유효범위를 가지며 export, import와 같은 키워드를 사용하지 않으면 다른 파일에서 접근할 수 없다.

## Export

ES6의 export와 같은 방식으로 변수, 함수, 타입, 인터페이스 등에 붙여 사용한다.

`ts-modules/types.ts`

```tsx
export interface Todo {
  title: string;
  checked: boolean;
}

// 혹은
// interface Todo { /* types... */ }
// export { Todo };
```

## Import

ES6의 import와 같은 방식으로 필요한 타입을 호출하여 사용한다.

`ts-modules/app.ts`

```tsx
import { Todo } from './types';

var item: Todo = {
  title: 'mobX 공부',
  checked: false,
};
```

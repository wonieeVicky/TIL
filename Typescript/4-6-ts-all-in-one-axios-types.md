﻿## Axios 타입 분석

### 다양한 방식으로 사용 가능한 axios

axios는 브라우저에서는 ky, 노드에서는 got으로 많이 사용되는 data fetching 라이브러리임,
ky, got 모두 가능함. fetch 기반은 아니며, XMLHttpRequest 기반이다.
해당 라이브러리를 import 해와서 가장 첫 시작이 되는 `index.d.ts`를 살펴보자

```tsx
// ..
declare const axios: AxiosStatic;
export default axios;
```

마지막에 `export default axios;`로 되어있으므로 ES2015 모듈이라는 것을 알 수 있다.
위 타입을 상세히 보기 위해 AxiosStatic을 타고 올라가보면 아래와 같다.

```tsx
export class Axios {
  constructor(config?: AxiosRequestConfig);
  defaults: AxiosDefaults;
  get<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
  delete<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
  // ..
}

export interface AxiosInstance extends Axios {
  <T = any, R = AxiosResponse<T>, D = any>(config: AxiosRequestConfig<D>): Promise<R>;
  <T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;

  // ..
}

export interface AxiosStatic extends AxiosInstance {
  create(config?: CreateAxiosDefaults): AxiosInstance;
  Cancel: CancelStatic;
  CancelToken: CancelTokenStatic;
  Axios: typeof Axios;
  AxiosError: typeof AxiosError;
  HttpStatusCode: typeof HttpStatusCode;
  readonly VERSION: string;
  isCancel: typeof isCancel;
  all: typeof all;
  spread: typeof spread;
  isAxiosError: typeof isAxiosError;
  toFormData: typeof toFormData;
  formToJSON: typeof formToJSON;
  CanceledError: typeof CanceledError;
  AxiosHeaders: typeof AxiosHeaders;
}
```

위 정의를 보면 `AxiosStatic`가 `AxiosInstance` 라는 함수를 상속(extends) 받은 것을 알 수 있음
인터페이스 타입은 함수를 정의받을 수 있음. 예를 들면 아래와 같다.

```tsx
const a = () => {};

// 자바스크립트는 함수에 속성을 추가가 가능하다.
a.b = "c";
a.e = "f";
a.z = "123";
```

자바스크립트는 어떤 면에선 기괴하다. 함수에 속성을 위와 같이 추가할 수 있음
위와 같은 흐름대로 위 `AxiosStatic`도 만들어진다고 생각하면 좀 쉽다.

```tsx
const a = () => {};
// 함수 안에 함수.속성으로 또 다른 함수를 정의할 수 있다.
a.create = () => {};
a.isAxiosError = () => {};
```

위처럼 함수 안에 `함수.속성`으로 또 다른 함수를 정의할 수 있으며,
이로 인해 위 interface AxiosStatic extends AxiosInstance 이 구조가 만들어질 수 있다.

그런데 웃긴건 이 `AxiosInstance`는 또 `Axios`라는 클래스에서 extend 되었다는 것이다.
(interface AxiosInstance extends Axios)

즉 위 타이핑을 통해 axios는 객체이면서 함수이면서 클래스인 것을 알 수 있으며,
실제 axios의 사용법은 3가지 이다.

```tsx
new axios(); // new 생성자로 가능
axios(); // 일반 함수로 생성 가능
axios.get(); // axios의 객체로 생성 가능
```

이처럼 다양한 사용방법이 있을 경우 위와 같은 타입 구조로 표현해뒀다는 것을 배워볼 수 있다.

### ts-node 사용하기

이제 get 메서드의 타입에 대해 알아보자

```tsx
export class Axios {
  // ..
  get<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
}
```

위와 같은 구조이다. AxiosResponse에 대한 것을 확인해보면 아래와 같음

```tsx
export interface AxiosResponse<T = any, D = any> {
  data: T;
  status: number;
  statusText: string;
  headers: RawAxiosResponseHeaders | AxiosResponseHeaders;
  config: AxiosRequestConfig<D>;
  request?: any;
}
```

그렇다면 아래 코드에서 실제 response가 어떻게 담겨오는지 확인해보자

```tsx
import axios from "axios";

(async () => {
  try {
    const response = await axios.get("https://jsonplaceholder.typicode.com/post/1");
    console.log(response);
  } catch (err) {}
})();
```

위와 같이 작성 후 아래 명령어 실행

```bash
> npx tsc axios.ts
> node axios.js
```

위 명령어 치는 과정이 귀찮으면 아래와 ts-node를 사용한다.

```bash
> npm i ts-node
> ts-node axios.ts

{
  status: 200,
  statusText: 'OK',
  headers: AxiosHeaders {
    // ..
  },
  data: {
    userId: 1,
    id: 1,
    title: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
    body: 'quia et suscipit\n' +
      'suscipit recusandae consequuntur expedita et cum\n' +
      'reprehenderit molestiae ut ut quas totam\n' +
      'nostrum rerum est autem sunt rem eveniet architecto'
  }
}
```

위처럼 실행시키면 한번에 axios 파일이 js파일로 번들링되어 node로 돌아가게 된다.

### 제네릭을 활용한 Response 타이핑

```tsx
(async () => {
  try {
    const response = await axios.get("https://jsonplaceholder.typicode.com/posts/1");
    console.log(response.data); // AxiosResponse<any, any>.data: any
    console.log(response.data.userId); // any
    console.log(response.data.id); // any
    console.log(response.data.title); // any
    console.log(response.data.body); // any
  } catch (err) {}
})();
```

위 구조에서 response.data는 any 타입이므로 하위 userId, id, title, body 등의 값들도 모두 any로 추론되어 에러가 발생하지 않음. 에러가 발생하지 않으면 끝이 아니다. 현재는 애니스크립트. 이를 타입스크립트로 만들어야 한다. 어떻게 만들 수 있을까?

```tsx
get<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
```

위 axios.get 메서드에서 우리는 `AxiosResponse<T>`를 채워줘야한다. T는 get의 첫 번째 제네릭으로 들어가므로 올바른 위치에 타입을 추가해준다. (현재 T의 기본값이 any 이므로 하위 모든 속성이 any로 추론됨)

```tsx
import axios, { AxiosResponse } from "axios";

// type Post = { userId: number; id: number; title: string; body: string };
interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

(async () => {
  try {
    const response = await axios.get<Post, AxiosResponse<Post>>("https://jsonplaceholder.typicode.com/posts/1");
    console.log(response.data);
    console.log(response.data.userId); // number
    console.log(response.data.id); // number
    console.log(response.data.title); // string
    console.log(response.data.body); // string
  } catch (err) {}
})();
```

위와 같이 타입을 제네릭으로 적용해주면 적절한 데이터가 내려오게 됨. 이번엔 post를 보자

```tsx
import axios, { AxiosResponse } from "axios";

interface Created {}
interface Data {
  title: string;
  body: string;
  userId: number;
}

(async () => {
  try {
    // post<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;

    // 방법 1
    await axios.post<Created, AxiosResponse<Created>, Data>("https://jsonplaceholder.typicode.com/posts", {
      title: "foo",
      body: "bar",
      userId: 1,
    });
    // 방법 2
    await axios<Created, AxiosResponse<Created>, Data>({
      method: "post",
      url: "https://jsonplaceholder.typicode.com/posts",
      data: {
        title: "foo",
        body: "bar",
        userId: 1,
      },
    });
  } catch (err) {}
})();
```

위처럼 post 메서드에 대한 타이핑 코드를 보고 적절한 위치에 적절한 타입을 추가하면 됨.
전달되는 데이터(D)의 경우 이후 사용되는 바가 없어 any로 처리되어도 무방하나 모든 타입이 추론되길 원하면 타이핑을 해주면 된다.

### AxiosError와 unknown error 대처법

서버에 요청을 보낼 때 항상 에러가 발생할 수 있다. 서버 혹은 브라우저의 문제가 다양하게 발생함
이러한 상황을 고려해야 하는데, 이때 axios.error는 어떻게 타이핑되어있는지 확인하자.

```tsx
export class AxiosError<T = unknown, D = any> extends Error {
  constructor(
    message?: string,
    code?: string,
    config?: AxiosRequestConfig<D>,
    request?: any,
    response?: AxiosResponse<T, D>
  );

  config?: AxiosRequestConfig<D>;
  code?: string;
  request?: any;
  response?: AxiosResponse<T, D>;
  isAxiosError: boolean;
  status?: number;
  toJSON: () => object;
  cause?: Error;
  static from<T = unknown, D = any>(
    error: Error | unknown,
    code?: string,
    config?: AxiosRequestConfig<D>,
    request?: any,
    response?: AxiosResponse<T, D>,
    customProps?: object
  ): AxiosError<T, D>;
  static readonly ERR_FR_TOO_MANY_REDIRECTS = "ERR_FR_TOO_MANY_REDIRECTS";
  static readonly ERR_BAD_OPTION_VALUE = "ERR_BAD_OPTION_VALUE";
  static readonly ERR_BAD_OPTION = "ERR_BAD_OPTION";
  static readonly ERR_NETWORK = "ERR_NETWORK";
  static readonly ERR_DEPRECATED = "ERR_DEPRECATED";
  static readonly ERR_BAD_RESPONSE = "ERR_BAD_RESPONSE";
  static readonly ERR_BAD_REQUEST = "ERR_BAD_REQUEST";
  static readonly ERR_NOT_SUPPORT = "ERR_NOT_SUPPORT";
  static readonly ERR_INVALID_URL = "ERR_INVALID_URL";
  static readonly ERR_CANCELED = "ERR_CANCELED";
  static readonly ECONNABORTED = "ECONNABORTED";
  static readonly ETIMEDOUT = "ETIMEDOUT";
}
```

위와 같은 데이터들이 AxiosError라는 클래스 타이핑으로 선언됨. 실제 error를 핸들링하는 곳을 보자

```tsx
(async () => {
  try {
    // axios codes..
  } catch (err) {
    console.error(err.response.data); // Error, 'err'은(는) 'unknown' 형식입니다.
  }
})();
```

위와 같이 err.response.data를 잡아보면 err가 unknown이라는 에러가 발생한다.
try 구조 안에 axios 가 아닌 다른 문법 에러가 발생할 수도 있기 때문에 unknown임(실행해야만 알 수 있다.)

따라서 위 에러는 아래와 같이 타입을 추가해서 처리할 수 있다.

```tsx
import axios, { AxiosError } from "axios";

(async () => {
  try {
    // axios codes..
  } catch (err) {
    const errorResponse = (err as AxiosError).response;
    console.log(errorResponse?.data); // Ok
  }
})();
```

하지만 위 방식도 100% 완전한 코드는 아니다. AxiosError가 아닐 경우에 대한 고려가 되어있지 않음
따라서 아래와 같이 바꿔본다.

```tsx
import axios, { AxiosError } from "axios";

(async () => {
  try {
    // axios codes..
  } catch (err) {
    // AxiosError를 타입가드로 사용하기 위해 클래스로 만들어진 것으로 보임
    if (err instanceof AxiosError) {
      // 커스텀 타입 가드
      err.response?.data; // (property) AxiosResponse<any, any>.data: any
    }
  }
})();
```

AxiosError의 클래스 방식으로 타입을 제공하므로 위와 같이 `instanceof`로 axios 에러만 골라낼 수 있다.
뿐만 아니라 axiosInstance를 보다보면 더 괜찮은 방법이 제공되는 것을 확인할 수 있다.

```tsx
export function isAxiosError<T = any, D = any>(payload: any): payload is AxiosError<T, D>;

export interface AxiosStatic extends AxiosInstance {
  create(config?: CreateAxiosDefaults): AxiosInstance;
  Cancel: CancelStatic;
  CancelToken: CancelTokenStatic;
  Axios: typeof Axios;
  AxiosError: typeof AxiosError;
  HttpStatusCode: typeof HttpStatusCode;
  readonly VERSION: string;
  isCancel: typeof isCancel;
  all: typeof all;
  spread: typeof spread;
  isAxiosError: typeof isAxiosError; // 여기에 이런게 있네
  toFormData: typeof toFormData;
  formToJSON: typeof formToJSON;
  CanceledError: typeof CanceledError;
  AxiosHeaders: typeof AxiosHeaders;
}

declare const axios: AxiosStatic;
```

즉 위 isAxiosError를 통해 아래와 같이 쓸 수도 있다.

```tsx
import axios, { AxiosError } from "axios";

(async () => {
  try {
    // axios codes..
  } catch (err) {
    if (axios.isAxiosError(err)) {
      err.response?.data; // (property) AxiosResponse<any, any>.data: any

      // { data: { result: 'Server Error' } }
      // 만약 예상치 못한 데이터로 인해 타입 에러가 발생하면 아래와 같이 처리한다.
      (err.response as AxiosResponse<{ result: string }>)?.data.result;
    }
  }
})();
```

위와 같이 반환 데이터에 대한 타이핑을 제네릭으로 추가해줄 수 있다. (하지만 최대한 as를 쓰지 않도록 한다.)
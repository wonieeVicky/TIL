## Axios 타입 분석

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

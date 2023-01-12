import axios, { AxiosError, AxiosResponse } from "axios";

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface Created {}
interface Data {
  title: string;
  body: string;
  userId: number;
}

interface Config<D = any> {
  method?: "get" | "post" | "put" | "delete" | "head" | "options" | "patch";
  url?: string;
  data?: D;
}
interface A {
  // 한번 선택값이 나오면 뒤에는 모두 선택값이 나와야한다.
  // 즉, R = AxiosResponse<T>로 선택값이므로, D = any로 선택값 처리
  get: <T = any, R = AxiosResponse<T>>(url: string) => Promise<R>;
  post: <T = any, R = AxiosResponse<T>, D = any>(url: string, data: D) => Promise<R>;
  <T, R = AxiosResponse<T>, D = any>(config: Config): Promise<R>;
  isAxiosError: (err: unknown) => err is AxiosError;
  (url: string, config: Config): void;
}

const a: A = axios;

(async () => {
  try {
    // get
    await a.get<Post, AxiosResponse<Post>>("https://jsonplaceholder.typicode.com/posts/1");
    // post
    await a.post<Created, AxiosResponse<Created>, Data>("https://jsonplaceholder.typicode.com/posts", {
      title: "foo",
      body: "bar",
      userId: 1,
    });
    // another case post
    await a<Created, AxiosResponse<Created>, Data>({
      method: "post",
      url: "https://jsonplaceholder.typicode.com/posts",
      data: {
        title: "foo",
        body: "bar",
        userId: 1,
      },
    });
  } catch (err) {
    if (a.isAxiosError(err)) {
      console.log((err.response as AxiosResponse<{ result: string }>)?.data.result);
    }
  }
})();

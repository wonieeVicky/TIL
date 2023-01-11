import axios, { AxiosError, AxiosResponse } from "axios";

// interface Post {
//   userId: number;
//   id: number;
//   title: string;
//   body: string;
// }
type Post = { userId: number; id: number; title: string; body: string };
interface Created {}
interface Data {
  title: string;
  body: string;
  userId: number;
}

(async () => {
  try {
    const response = await axios.get<Post, AxiosResponse<Post>>("https://jsonplaceholder.typicode.com/posts/1");

    // post<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
    await axios.post<Created, AxiosResponse<Created>, Data>("https://jsonplaceholder.typicode.com/posts", {
      title: "foo",
      body: "bar",
      userId: 1,
    });

    await axios<Created, AxiosResponse<Created>, Data>({
      method: "post",
      url: "https://jsonplaceholder.typicode.com/posts",
      data: {
        title: "foo",
        body: "bar",
        userId: 1,
      },
    });
  } catch (err) {
    if (axios.isAxiosError(err)) {
      // { data: { message: 'Server Error' } }
      err.response?.data.message;
      // 만약 예상치 못한 데이터로 인해 타입 에러가 발생하면 아래와 같이 처리한다.
      (err.response as AxiosResponse<{ result: string }>)?.data.result;
    }
    // console.error(err.response.data); // Error, 'err'은(는) 'unknown' 형식입니다.
    // axios 가 아닌 다른 문법 에러가 발생할 수도 있음. 따라서 unknown 타입으로 지정해줌.
    // const errorResponse = (err as AxiosError).response;
    // console.log(errorResponse?.data); // Ok
  }
})();

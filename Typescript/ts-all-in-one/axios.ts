import axios, { AxiosResponse } from "axios";

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
  } catch (err) {}
})();

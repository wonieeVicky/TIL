import axios from "./node_modules/axios/index";

(async () => {
  try {
    await axios.get("https://jsonplaceholder.typicode.com/post/1");
  } catch (err) {}
})();

const a = () => {};
// 함수에 속성을 추가
a.b = "c";
a.e = "f";
a.z = "123";

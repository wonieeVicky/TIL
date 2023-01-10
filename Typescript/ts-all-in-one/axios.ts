import axios from "axios";
console.log(11);
(async () => {
  try {
    console.log(123);
    const response = await axios.get("https://jsonplaceholder.typicode.com/posts/1");
    console.log(response);
  } catch (err) {}
})();

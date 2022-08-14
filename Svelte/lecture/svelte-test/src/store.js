import { readable } from "svelte/store";

const userData = {
  name: "Vicky",
  age: 33,
  email: "hwfongfing@gmail.com",
  token: "Adkwenqa91s",
};

export let user = readable(userData, (set) => {
  console.log("user 구독자가 1명 이상일 때!");
  delete userData.token; // token 속성을 삭제함
  set(userData); // token을 제외한 userData를 저장함

  return () => {
    console.log("user 구독자가 0명일 때...");
  };
});

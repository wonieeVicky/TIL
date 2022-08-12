import { writable } from "svelte/store";

export let count = writable(0, () => {
  console.log("count 구독자가 1명 이상일 때!");
  return () => {
    console.log("count 구독쟈가 0명일 때..");
  };
});

export let name = writable("Vicky", () => {
  console.log("name 구독자가 1명 이상일 때!");
  return () => {
    console.log("name 구독쟈가 0명일 때..");
  };
});

import { writable, derived, readable, get } from "svelte/store";

export let count = writable(1);
export let double = derived(count, ($count) => $count * 2);
export let user = readable({ name: "Vicky", age: 33, email: "hwfongfing@gmail.com" });

console.log(get(count)); // 1
console.log(get(double)); // 2
console.log(get(user)); // { name: "Vicky", age: 33, email: "hwfongfing@gmail.com" }

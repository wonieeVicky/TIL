import { writable } from "svelte/store";

const { set, update, subscribe } = writable(0);

export let count = {
  set,
  update,
  subscribe,
  increment: () => update((n) => n + 1),
  decrement: () => update((n) => n - 1),
  reset: () => set(0),
};

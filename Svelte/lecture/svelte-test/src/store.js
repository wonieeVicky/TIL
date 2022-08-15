import { writable, derived } from "svelte/store";

export let count = writable(1);
export let double = derived(count, ($count) => $count * 2);
export let total = derived([count, double], ([$count, $double], set) => set($count + $double));
export let initialValue = derived(count, ($count, set) => setTimeout(() => set($count + 1), 1000), "최초 계산 중...");

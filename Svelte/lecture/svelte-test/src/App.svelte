<script>
  import { get } from "svelte/store";
  import { count, double, user } from "./store.js";

  console.log(get(count)); // 1
  console.log(get(double)); // 2
  console.log(get(user)); // { name: "Vicky", age: 33, email: "hwfongfing@gmail.com" }
</script>

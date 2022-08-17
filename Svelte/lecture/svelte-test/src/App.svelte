<script>
  import { count } from "./count.js";
</script>

<h1>{$count}</h1>
<button on:click={count.increment}>+</button>
<button on:click={count.decrement}>-</button>
<button on:click={count.reset}>reset</button>

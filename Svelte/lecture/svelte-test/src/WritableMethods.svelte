<script>
  import { count, name } from "./store.js";

  function increase() {
    $count += 1;
  }

  function changeName() {
    $name = "Wonny";
  }
</script>

<button on:click={increase} on:click={changeName}>Click Me!</button>

<h2>{$count}</h2>
<h2>{$name}</h2>

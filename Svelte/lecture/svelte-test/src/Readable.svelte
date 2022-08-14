<script>
  import { user } from "./store.js";

  console.log(user); // { subscribe: f }
  console.log($user);
</script>

<button on:click={() => ($user.name = "Wonny")}>Click!</button>

<h2>{$user.name}</h2>

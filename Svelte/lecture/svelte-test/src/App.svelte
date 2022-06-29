<script>
  import Fruits from "./Fruits.svelte";
</script>

<h2>App.svelte</h2>
<ul class="fruits">
  <li>Apple</li>
  <li>Banana</li>
  <li>Cherry</li>
</ul>

<Fruits />

<style>
  :global(.fruits) {
    color: red;
  }
  :global(.vicky) {
    color: orange;
  }
</style>

<!-- <svelte:options immutable /> -->
<script>
  import { afterUpdate } from "svelte";
  export let name;
  // 기존 fruit === 새로운 fruit

  let updateCount = 0;
  afterUpdate(() => (updateCount += 1));
</script>

<div>{name}({updateCount})</div>

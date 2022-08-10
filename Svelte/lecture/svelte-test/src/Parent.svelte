<script>
  import Child from "./Child.svelte";
</script>

<Child let:scoped>
  <slot />
  <slot name="named" slot="named-child" />
  <slot name="scoped" slot="scoped-child" {scoped} />
</Child>

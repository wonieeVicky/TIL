<script>
  export let value;
  export let color;
  // $$props
  // $$restProps
</script>

<div class="my-custom-input"><input style="color: {color}" bind:value {...$$restProps} /></div>

<style>
  .my-custom-input input {
    border-radius: 100px;
    padding: 10px 20px;
  }
</style>

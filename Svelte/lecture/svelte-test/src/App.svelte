<script>
  let toggle = true;
  let width = 200;

  const hello = (node, options = {}) => {
    // console.log("init function !");
    const { width = "100px", height = "100px", color = "tomato" } = options;
    // console.log(node); // <div></div>
    node.style.width = width;
    node.style.height = height;
    node.style.backgroundColor = color;

    return {
      update: (opts) => {
        console.log("update", opts);
        node.style.width = opts.width;
      },
      destroy: () => console.log("destroy"),
    };
  };
</script>

<button on:click={() => (toggle = !toggle)}>Toggle!</button>
<button on:click={() => (width += 20)}>Size up!</button>

<div use:hello />
{#if toggle}
  <div
    use:hello={{
      width: `${width}px`,
      height: "70px",
      color: "royalblue",
    }}
  />
{/if}

<script>
  function zoom(node, scale = "1.5") {
    node.style.transition = "1s";
    function zoomIn() {
      node.style.transform = `scale(${scale})`;
    }
    function zoomOut() {
      node.style.transform = "scale(1)";
    }
    node.addEventListener("mouseenter", zoomIn);
    node.addEventListener("mouseleave", zoomOut);

    return {
      destroy() {
        node.removeEventListener("mouseenter", zoomIn);
        node.removeEventListener("mouseleave", zoomOut);
      },
    };
  }
</script>

<div use:zoom />
<div use:zoom={0.7} />

<style>
  div {
    width: 100px;
    height: 100px;
    background-color: tomato;
  }
</style>

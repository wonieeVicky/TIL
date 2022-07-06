<script>
  let innerHTML = "";
  let textContent = "Hello vicky!!";
</script>

<div contenteditable bind:innerHTML bind:textContent />
<span>innerHTML</span>
<div>{innerHTML}</div>
<span>textContent</span>
<div>{textContent}</div>
<span>@html innerHTML</span>
<div>{@html innerHTML}</div>

<style>
  div {
    border: 1px solid orange;
    margin-bottom: 10px;
  }
  span {
    display: inline-block;
    margin-bottom: 10px;
    font-weight: bold;
  }
</style>

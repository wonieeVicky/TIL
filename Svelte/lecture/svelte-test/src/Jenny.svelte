<!-- document.head -->
<svelte:head>
  <link rel="stylesheet" href="./main.css" />
</svelte:head>

<!-- document.body -->
<svelte:body on:mousemove={(e) => console.log(e.clientX, e.clientY)} />
<h1>Jenny!</h1>

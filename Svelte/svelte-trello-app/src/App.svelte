<script>
  import Header from "~/components/Header.svelte"

  // document.body.style.backgroundImage = "url(/images/bg.jpg)"
  // document.body.style.backgroundSize = "cover"

  Object.assign(document.body.style, {
    backgroundColor: "darkgray",
    backgroundImage: "url(/images/bg.jpg)",
    backgroundSize: "cover",
  })
</script>

<Header />

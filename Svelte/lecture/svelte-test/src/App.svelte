<script>
  import Card from "./Card.svelte";
</script>

<Card>
  <div slot="age">85</div>
  <h2 slot="name">Vicky</h2>
  <div slot="email" let:domain let:hello>hwfongfing{domain} / {hello}</div>
</Card>
<Card>
  <span slot="email" let:domain>fongfing{domain}</span>
  <h3 slot="name">fongfing</h3>
</Card>

<style>
  h3 {
    color: red;
  }
</style>

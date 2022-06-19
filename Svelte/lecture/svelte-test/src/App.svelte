<script>
  import { tick } from "svelte";
  let name = "world";

  async function handler() {
    name = "Vicky";
    // tick은 어떤 데이터가 화면에 갱신될 떄까지 기다린 뒤 실행하는 역할을 한다.
    await tick(); // Promise 객체를 반환함
    const h1 = document.querySelector("h1");
    console.log(h1.innerText); // Hello Vicky!
  }
</script>

<h1 on:click={handler}>Hello {name}!</h1>

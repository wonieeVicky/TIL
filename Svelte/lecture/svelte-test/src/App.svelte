<script>
  import Wrap from "./Wrap.svelte";

  let fruits = {
    apple: {
      value: "",
      options: {
        readonly: false,
        disabled: false,
        placeholder: "placeholder A",
      },
    },
    banana: {
      value: "BANANA",
      options: {
        disabled: false,
        placeholder: "placeholder",
      },
    },
  };

  function add(name) {
    console.log(name);
  }
  function update(name) {
    console.log(name);
  }
  function remove(name) {
    console.log(name);
  }
</script>

<label name="apple" class="fruits__apple">
  <input
    bind:value={fruits.apple.value}
    readonly={fruits.apple.options.readonly}
    disabled={fruits.apple.options.disabled}
    placeholder={fruits.apple.options.placeholder}
    on:change={() => add("apple")}
  />
</label>

<!-- 각 과일마다 컴포넌트를 다 따로 생성해야할까? -->
<!-- <label name="banana" class="fruits__banana">
  <input
    bind:value={fruits.banana.value}
    readonly={fruits.banana.options.readonly}
    disabled={fruits.banana.options.disabled}
    placeholder={fruits.banana.options.placeholder}
    on:change={() => add("banana")}
  />
</label> -->

<Wrap scopeName="apple" let:_name>
  <label name={_name} class="fruits__{_name}">
    <input
      bind:value={fruits[_name].value}
      readonly={fruits[_name].options.readonly}
      disabled={fruits[_name].options.disabled}
      placeholder={fruits[_name].options.placeholder}
      on:change={() => add(_name)}
    />
  </label>
</Wrap>
<Wrap scopeName="banana" let:_name>
  <label name={_name} class="fruits__{_name}">
    <input
      bind:value={fruits[_name].value}
      readonly={fruits[_name].options.readonly}
      disabled={fruits[_name].options.disabled}
      placeholder={fruits[_name].options.placeholder}
      on:change={() => add(_name)}
    />
  </label>
</Wrap>

## 사용자 입력 핸들링

### 인라인 이벤트 핸들러

Svelte에서 사용자 입력 핸들링을 만들 때 인라인 핸들러 사용을 추천하는 이유에 대해 한번 더 알아보고자 한다. 스벨트는 자기 자신이 컴파일러이므로 입력핸들링을 내부 인라인으로 작성하더라도 해당 코드를 충분히 최적화할 수 있기 때문이다. 따라서 해당 사용을 권장한다. 반면에 React나 Vue를 사용하면 가상돔을 사용하므로 인라인 핸들러를 가급적 줄이도록 권고하고 있다.

특히나 반복문을 사용할 경우 인라인 핸들러를 사용할 경우 반복되는 아이템의 갯수만큼 런타임 환경에서 메모리를 차지하게 되고, 그만큼 성능이 저하되기 때문이다. 따라서 메소드를 만들어 핸들러를 연결하여 사용하도록 권고하고 있는 것이다.

`App.svelte`

```html
<script>
  let fruits = [
    { id: 1, name: "Apple" },
    { id: 2, name: "Banana" },
    { id: 3, name: "Cherry" },
  ];
  function assign(fruit) {
    fruit.name += "!";
    fruits = fruits;
    // $$invalidate(0, fruits);
  }
</script>

<section>
  {#each fruits as fruit (fruit.id)}
    <div on:click={() => assign(fruit)}>
      {fruit.name}
    </div>
  {/each}
</section>
```

위와 같이 과일들의 목록이 담긴 `fruits` 배열과 클릭 시 이름 뒤에 느낌표를 추가해주는 `assign` 함수가 있다고 하자. 아래 each 문에서는 fruit.id를 키 값으로 하는 리스트가 생성되도록 구현되어 있으며, 해당 div에 클릭 시 fruit 데이터가 인수로 들어가 이름 뒤에 느낌표를 추가하도록 동작하는 소스이다.

이때 위 each 문이 아래와 같다면 어떻게 될까?

```html
<section>
  {#each fruits as fruit (fruit.id)}
    <div on:click={() => (fruit.name += "!")}>
      {fruit.name}
    </div>
  {/each}
	<!-- $$invalidate(0, each_value_1[fruit_index].name += "!", fruits) -->
</section>
```

`assign` 함수를 별도로 넣지 않고, 해당 div 클릭 시 `fruit.name`에 직접 느낌표가 추가되도록 변경해도 해당 컴포넌트는 문제없이 동작하며, 해당 데이터를 공유하는 다른 공간에서도 동일하게 변경사항이 반영된다.

위 코드를 번들 결과로 확인해보면 해당 each 문이 돌아갈 때 위 $$invalidate 함수가 동작하면서 내부 반응성을 가지도록 되어있다. 이 때문에 반복문 내부에 인라인 코드를 넣을 때 아래와 같이 `fruits = fruits;` 코드를 넣어주지 않아도 되는 것이다.

```html
<!-- 아래처럼 하지 않아도 된다. -->
<div on:click={() => {
  fruit.name += "!"
  fruits = fruits;
}}>
	{fruit.name}
</div>
```

`assign` 함수에서 돌아가는 fruits는 인라인 코드 외부에서 돌아가므로 fruits가 어떤 데이터인지 확실하지 않으므로 명시해줘야하는 부분이지만, 위처럼 내부 인라인으로 반복문이 돌아가는 경우 fruits라는 데이터 안에서 실행되는 코드이므로 명시적인 대입을 하지 않아줘도 되는 것임

```html
<section>
  {#each fruits as { id, name } (id)}
    <div on:click={() => (name += "!")}>
      {name}
    </div>
  {/each}
  <!-- $$invalidate(0, each_value[each_index].name += "!", fruits) -->
</section>
```

위 코드는 전개 연산자를 통해 좀 더 개선시킨 버전이다. 빌드 파일로 보면 $$invalidate라는 코드로 실제 데이터가 갱신(반응성)이 되도록 구조가 만들어지는 것을 확인할 수 있다.

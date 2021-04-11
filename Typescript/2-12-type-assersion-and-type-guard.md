# 타입 단언, 타입 가드

## 타입 단언(Type assertion)

타입 단언(Type assertion)은 DOM API를 조작할 때 많이 사용되어지는 타입 정의 방식이다.
간단한 예시를 보자

```tsx
var a; // a: any
var b = 10; // b: number
var c = a; // c: any
```

위 `a`, `b` 변수는 모두 타입 추론방식에 의해 각각 any와 number로 타입 추론이 된다. `c`의 경우 `a`의 값을 부여해주므로 `a`의 타입에 따라 any로 추론된다.

```tsx
var d = a as string; // d: string
```

위 `d`의 경우 `a`의 값을 부여해주었으나 뒤에 as라는 메서드를 붙여 string으로 정의해주었으므로 `d`의 타입은 string으로 추론되는데, 이를 타입 단언이라 한다!

### DOM API를 조작할 때 사용하는 타입 단언

```html
<div id="app">app</div>
```

만약 위 `#app` 돔에 접근하는 스크립트가 있다고 해보자.

```tsx
var div = document.querySelector('#app'); // HTMLDivElement | null로 타입 추론
// div.innerText = 'abc'; // Type error!
div?.innerTexxt = 'abc'; // div가 null일 경우에 따른 분기처리를 사전에 처리해야한다.
```

위와 같이 #app 엘리먼트를 변수로 담았을 때 타입이 추론은 `HTMLDivElement | null` 로 되므로 DOM 조작 시에는 반드시 해당 돔이 있는지 여부에 대한 체크를 `if문`이나 `optional chaining(?.)`를 통해 해줘야 타입 체크 시 에러가 발생하지 않는다.

하지만 타입 단언을 통해서는 아래와 같이 처리를 해줄 수 있다

```tsx
var div = document.querySelector('#app') as HTMLDivElement; // 해당 타입이 HTMLDivElement일것이라고 타입을 단언한다.
div.innerText = 'abc';
```

위 div 변수의 값이 HTMLDivElement일 거라고 타입 단언을 해주면, 이후 별도의 돔 여부에 대한 체크 없이도 코드에 타입 에러가 발생하지 않는다.

> 타입 단언은 개발자가 타입에 대해 정확히 알고 있을 경우, 타입스크립트의 추론이 아닌 개발자의 타입 단언을 통해 타입을 지정하는 것을 의미한다.

## 타입 가드(Type guard)

타입 가드는 타입 단언는 다른 타입 선언 방법을 제공한다. 예시를 보면서 살펴보자.

```tsx
interface Developer {
  name: string;
  skill: string;
}

interface Person {
  name: string;
  age: number;
}

function introduce(): Developer | Person {
  return { name: 'Vicky', age: 32, skill: 'React' };
}
```

만약 위와 같은 `Developer`와 `Person` 타입이 있다고 치자.  
introduce 함수에서는 유니온 타입으로 두 인터페이스 타입을 return 타입으로 받는 것을 볼 수 있다.

```tsx
var vicky = introduce();
console.log(vicky.name); // Vicky
console.log(vicky.skill); // Type error! Union 타입을 썻을 때에는 공통된 속성만 접근이 가능하므로 SKILL 접근 불가
```

이때 해당 함수를 vicky라는 변수에 담아서 name과 skill 속성에 접근한다고 했을 때 name은 성공적으로 값이 반환되지만 skill은 타입 에러가 발생한다. 이유는 Union 타입을 한 개 이상 사용했을 때 공통된 속성만 접근이 가능하기 때문이다. 즉, Developer와 Person 타입의 공통된 속성인 name만 접근 가능

이럴 때에도 위의 타입 단언을 사용할 수 있다.

```tsx
// 타입 단언
if ((vicky as Developer).skill) {
  var skill = (vicky as Developer).skill;
  console.log(skill); // React
} else if ((vicky as Person).age) {
  var age = (vicky as Person).age;
  console.log(age); // 32
}
```

위와 같이 if 분기를 통해 vicky 변수에 타입 단언으로 Developer와 Person을 주었고, 해당 단언이 되었을 경우에는 각 인터페이스에 존재하는 속성(skill, age)에 접근할 수 있다.

하지만 위의 방법은 코드가 너무 복잡해진다. 이때 타입 가드를 사용할 수 있음

### 타입 가드 소개 및 적용

타입 가드는 함수이며, 해당 타입이 맞는지 아닌지를 true, false로 반환할 수 있도록 타입 체크를 해준다.

```tsx
// 타입 가드 정의(is)
function isDeveloper(target: Developer | Person): target is Developer {
  return (target as Developer).skill !== undefined;
}
```

위와 같이 IsDeveloper함수로 target 인자에 대한 속성값에 접근할 수 있는지 여부를 가지고 true, false를 반환해준다. 이렇게 되면 위 타입 단언을 통해 접근할 수 있었던 코드가 아래와 같이 줄여진다.

```tsx
if (isDeveloper(vicky)) {
  // Developer 타입이라면
  console.log(vicky.skill); // React
} else {
  // Developer 타입이 아니라면
  console.log(vicky.age); // 32
}
```

위 타입 단언 및 타입 가드는 실무에서 자주 사용되므로 익숙하게 사용할 수 있도록 다양하게 실무에 적용해보도록 노력하자 !!

# 비동기: 동시성 프로그래밍

### callback과 Promise

자바스크립트에서 비동기 동시성 프로그래밍을 하는 방법은 크게 두가지가 있다. 오랫동안 사용되어 온 Callback 패턴을 사용하는 방법과 Promise를 기반으로 함수를 합성하는 방법이다. Promise에서 발전된 async ~ await으로 구현하는 방법도 있다.

그렇다면 Promise와 콜백 방법의 차이점은 무엇이고, 함수형 프로그래밍과 Promise와의 조합은 어떻게 할 수 있을까? 아래 Callback 패턴과 Promise 패턴 코드를 비교해보면서 하나씩 알아가본다.
우선 add10 함수는 Callback 함수로 100ms 이후에 동작을 실행한다.

```jsx
function add10(a, callback) {
  setTimeout(() => callback(a + 10), 100);
}
add10(5, res => {
	add10(res, res => {
		add10(res, res => {
			log(res);
		});
	});
}); // 300ms 후 35
```

위 함수를 `Promise`를 통해 구현하면 아래와 같다.

```jsx
function add20(a) {
  return new Promise(resolve => setTimeout(() => resolve(a + 20), 100));
}
add20(5).then(add20).then(add20).then(log); // 300ms 후 65
```

같은 기능을 하는 함수를 Callback 함수와 Promise로 각각 구현했을 때, Callback 함수의 경우 함수 내 중첩 함수가 많아져서 Promise 구조에 비해 복잡하여 가독성이 떨어지는 것을 알 수 있다.

### 비동기를 값으로 만드는 Promise

위와 같이 Promise와 Callback 패턴의 차이점은 코드 구조의 차이도 있지만 이는 중요한 차이점이 아니다. 즉, 콜백지옥과 Promise 패턴을 통해 then으로 가독성 높게 코드를 구현하는 것이 중요한 것이 아니다.

Promise와 콜백함수의 가장 중요한 차이는 어떻게 결과를 꺼내어 보느냐가 아닌 비동기 상황을 일급 값으로 다룬다는 점이다.  Promise는 Promise라는 클래스를 통해 만들어진 인스턴스를 반환하는데, 그 반환값은 `대기`, `성공`, `실패`를 다루는 일급 값으로 이루어져 있다. 즉, '대기되어지고 있다'는 값을 만든다는 점에서 콜백과 큰 차이를 가지는 것이다.

이 점을 정확히 떠올리면서 프로그래밍을 할 줄 알면 그에 따른 응용할 수 있는 아이디어가 많아지므로 주의 깊게 살펴볼 필요가 있다. 즉 `add20` 함수는 비동기 상황에 대한 값을 만들어 리턴한다는 점이 포인트인 것이다!

위 `add10`과 `add20`에 대한 결과값을 보자

```jsx
var a = add10(5, res => {
	add10(res, res => {
		add10(res, res => {
			log(res);
		});
	});
});
log(a); // undefined
add10(5, _ => _); // undefined

var b = add20(5).then(add20).then(add20).then(log); // Promise {<pending>}
add20(5, _ => _); // Promise {<pending>}
```

`add20`이 `add10` 함수와 비교하여 가진 가장 큰 이점이자 차이는 위처럼 Promise에 대한 결과값을 즉시 반환한다는 점이다. 이 때문에 그 이후에 원하는 어떤 일들을 쉽게 다룰 수 있다. 즉 `add10`은 함수 실행이 끝난 후 어떤 것도 실행할 수 없지만 `add20`의 경우 실행이 완료된 후 원하는 일을 추가적으로 할 수 있게되는 것이다.

```jsx
var step1 = add20(5, _ => _); // Promise {<pending>}
step1 // Promise {<resolved>: 25}
var step2 = step1.then(a => a - 5);
step2 // Promise {<resolved>: 20}
var step3 = step2.then(a => a * 10);
step3 // Promise {<resolved>: 200}
```

즉, 비동기로 일어난 상황에 대해 값으로 다룰 수 있고, 값으로 다룰 수 있다는 것은 즉 일급이라는 것이고, 일급이라는 것은 어떤 변수에 할당되거나, 어떤 함수에 전달되거나, 전달된 값을 가지고 yield를 이어나갈 수 있다는 것을 의미한다. 이는 매우 중요한 차이이다..! ⭐️⭐️⭐️

### 값으로서의 Promise 활용

Promise가 비동기 상황을 값으로 다루는 일급의 성질을 가지고 있다는 점을 활용해 다양한 것들을 할 수 있다.
효과적으로 코드를 정리하고 좋은 로직을 만드는데 있어서 필요한 좋은 함수를 많이 만들어볼 수 있다. 

아래 예제코드를 보자

```jsx
const go1 = (a, f) => f(a);
const add5 = a => a + 5;

log(go1(10, add5)); // 15
```

위 `go1` 함수가 정상적으로 동작하기 위해서는 몇가지 전제 조건이 필요하다. 먼저 `f`라는 함수가 동기적으로 동작하는 함수여야 하고, a라는 값 역시 동기적으로 바로 값을 알 수 있는 상태여야 한다. 즉 비동기 상황이 일어난 일급 값이 아닌 일반 값이 들어와야 해당 함수가 정상적으로 실행될 수 있다는 것을 의미한다.

그럼 만약 해당 값이 비동기 코드로 받아오는 값이 된다면 어떻게 될까? 
당연히 아래처럼 정상적인 실행이 되지 않을 것이다. 

```jsx
log(go1(Promise.resolve(10), add5)); // [object Promise]5

// 100ms 후에 받은 값을 리턴하는 함수
const delay100 = a => new Promise(resolve => setTimeout(() => resolve(a) ,100));
log(go(delay100(10), add5)); // [object Promise]5
```

위 코드도 정상적으로 실행될 수 있도록 `go1` 함수를 다형성을 지원하도록 변경해보자

```jsx
// a가 Promise 객체이면 then으로 처리, 아니면 일반 동기 처리
const go1 = (a, f) => a instanceof Promise ? a.then(f) : f(a);

var r = go1(10, add5);
log(r); // 15

var r2 = go1(delay100(10), add5)); // Promise {<pending>} - [[PromiseValue]]: 15
r2.then(log); // 15
```

위와 같이 변경하면 `r`과 `r2` 값 모두 `15`를 만들 수 있는 상태가 만들어진다. `r`과 `r2`가 동일한 역할을 하게 되는 것이다. 위 함수는 아래와 같이 리팩토링 할 수 있다.

```jsx
go1(go1(10, add5), log); // 15
go1(go1(delay100(10), add5), log); // 15

// 혹은 아래와 같이 만들면 더 비슷해보인다.
const n1 = 10;
go1(go1(n1, add5), log); // 15
log(go1(go1(n1, add5), log)); // undefined

const n2 = delay100(10);
go1(go1(n2, add5), log); // 15
log(go1(go1(n2, add5), log)); // Promise {<pending>} : 값을 지속적으로 더 만들어나갈 수 있다. 이것이 차이점이다.
```

### 합성 관점에서의 Promise와 모나드

이번에는 함수 합성 관점에서의 Promise를 논해보자 

Promise는 비동기 상황에서 함수 합성을 안전하게 하기 위한 도구라고 볼 수 있다. 비동기 값을 가지고 연속적인 함수 실행 및 합성을 안전하게 처리하는 모나드라고 할 수 있는 것이다. 

자바스크립트는 동적 타입 언어이고, 타입을 중심적으로 사고하면서 프로그래밍 하는 언어가 아니기 때문에 모나드라던지 대수구조의 타입이라던지 하는 것들이 잘 뭍어나지 않는 경향이 있다. 즉 직접적으로 모나드를 이용한 프로그래밍은 거의 이루어지지 않는다는 것이다. 하지만 그렇다고해서 모나드를 알아둘 필요가 없는 것은 아니다. 모나드란 함수 합성을 안전하게 하기 위한 도구로, 아래의 예시를 보면서 이해를 해보도록 하자!

```jsx
const g = a => a + 1;
const f = a -> a * a;

log(f(g(1))); // 4 - 정상적으로 연속적으로 매개변수가 전달됨
log(f(g())); // NaN - 매개변수에 빈 값을 주면 NaN으로 반환, 어떤 값이 들어올지 모르는 상황이 이에 속한다.
```

위 `f(g(1));` 은 대표적으로 `g`와 `f` 함수를 합성한 예시이다.  위 `f(g());` 는 매개변수의 빈 값이 들어가 NaN으로 반환되는 안전하지 않는 함수 합성 관계이며, 이 함수는 나아가 어떤 값이 들어올지 모르는 상황의 함수가 비슷하다고 볼 수 있다.

비동기 처리로 인해 어떠한 값이 들어올지 모르는 함수 합성을 어떻게하면 안전하게 할 수 있을까? 바로 모나드를 이용하면 된다. 

```jsx
// f(g(1)); 코드는 아래와 같이 구현할 수 있다.
log(Array.of(1).map(g).map(f)); // [4]
[1].map(g).map(f).forEach(r => log(r)); // 4
```

값을 배열로서 선언적으로 가지고 있는 형태로 바뀐 것이다. forEach에 따라 값이 있으면 반환하는 형식으로 바뀐 이 구조를 모나드라고 할 수 있는데, 값이 담긴 배열이 빈 배열일 경우 NaN이 아닌 코드 실행을 멈추기 때문이다.

```jsx
// (f(g()); 코드는 아래와 같이 구현할 수 있다.
[].map(g).map(f).forEach(r => log(r)); // 함수 실행이 되지 않는다.
```

위와 같이 배열이 비어있을 경우 함수 실행 자체가 이루어지지 않는 것이다. 기존의 `f(g())`의 경우 인자의 유무에 상관없이 함수 실행이 되어버려 효과(NaN)까지 가버리는 반면, 모나드 형태의 배열로 함수를 합성했을 때는 조건이 맞지 않으면 효과가 아예 발생하지 않는 구조로 바뀐 것이다. 

그렇다면 `Promise`는 어떠한 함수 합성을 하는 값인 것일까? `Promise`는 `then`이란 메서드를 통해 함수를 합성한다.

```jsx
Promise.resolve(1).then(g).then(f).then(r => log(r)); // 1
Promise.resolve(2).then(g).then(f).then(r => log(r)); // 4
Promise.resolve().then(g).then(f).then(r => log(r)); // NaN
```

그런데 위 `Promise.resolve()`를 보면 똑같이 `NaN`을 반환한다. 안전한 함수합성이 되지 않은 것이다. 그렇다면 문제가 아닐까 ? 이는 즉 `Promise`는 전달되는 인자가 있거나 없거나 하는 관점에서의 안전한 함수 합성을 하려는 것이 아닌 비동기 상황 즉, 대기가 일어난 상황에서 안전한 함수 합성을 하려는 성질을 가지고 있다는 것을 의미한다. 아래 예시를 보자

```jsx
new Promise(resolve => setTimeout(() => resolve(2), 100)).then(g).then(f).then(r => log(r));
```

모나드의 개념이 무엇인지에 집중하지말자. 모나드란 안전하게 함수를 합성하기 위한 도구이며, 위 코드처럼 Promise는 비동기적으로 일어난 어떤 특정 상황을 안전하게 합성하기 위한 하나의 도구가 되므로, 합성관점에서 비동기 상황에서도 함수를 적절한 시점에 평가해서 합성시키기 위한 도구로서 Promise를 바라볼 수 있다는 것을 기억하는 것에 집중하자.

### Kleisli Composition 관점에서의 Promise

`Promise`는 Kleisli Composition을 지원하는 도구가 되기도 한다. Kleisli Composition는 Kleisli Arrow라고도 불리우는 하나의 함수 합성 방법으로 오류가 있을 수 있는 상황에서 함수 합성을 안전하게 하는 하나의 규칙이다. 현대 프로그래밍에서는 상태와 효과, 외부적인 것의 의존 등 다양한 상황에 의해 함수 합성이 예상한대로 이루어지지 않을 수 있는 가능성을 가지고 있다. Kleisli Composition은 들어오는 인자가 에러를 발생시키는 잘못된 인자이거나, 정상적인 인자 전달 후에도 의존하고 있는 외부의 상태에 의해 결과를 전달할 수 없는 상황일 때 에러가 나는 것을 해결하기 위한 함수 합성 방법이다.

```jsx
// f. g
f(g(x) = f(g(x))
```

`f`와 `g`를 위와 같이 합성했다고 했을 때 `x`가 전달되었을 때의 결과는 어느 시점에 평가를 하더라도 항상 동일하기 때문에 위 식이 성립한다. `x`의 값이 같을 때 양변은 언제나 같은 결과를 반환한다는 의미이다.

그러나 실제 실무에서 한 변이 평가할 때의 g(x)가 다른 변이 평가될 때의 g(x)가 다른 값으로 변환되거나 값이 없어져서 오류가 났을 때에는 위 합성식이 성립하지 않게 될 수도 있다. 사실상 순수한 함수 프로그래밍을 할 수 없다고 볼 수 있는 것이다.

그러나 그런 상황에서도 특정한 규칙을 만들어서 함수를 안전하게 만들고, 이것을 조금더 수학적으로 바라볼 수 있도록 만드는 함수 합성이 Kleisli Composition이다. Kleisli Composition는 아래와 같은 규칙을 가지고 있다.

```jsx
// f(g(x)) = g(x)
```

만일 `g`에서 에러가 난 경우 `f(g(x))` 결과와 `g(x)`를 같은 결과로 합성하는 것이다. x의 상태에 따라 원하지 않는 결과를 만들었을 때, `f(g(x)) = g(x)` 처리하는 것이다. 코드로 더 살펴보자

```jsx
// 유저 정보
var users = [
  {id: 1, name: 'aa'},
  {id: 2, name: 'bb'},
  {id: 3, name: 'cc'}
];
// Id 값으로 유저 찾는 함수
const getUserById = id =>
  find(u => u.id == id, users) || Promise.reject('없어요!');
// 객체에서 name을 추출해서 반환하는 함수
const f = ({name}) => name;
const g = getUserById;
```

위 g를 통해 users 상태에서 user를 찾고 f를 연속적으로 실행해 name을 추출하는 함수를 합성을 한다고 하면 아래와 같이 할 수 있다.

```jsx
const fg = id => f(g(id));
fg(2); // bb
fg(2) === fg(2) // true
```

예상한 결과대로 위 함수 합성이 실행되며, 두 함수가 언제나 같은 값을 반환하도록 실행되는 것이다.
그러나 실세계 프로그래밍에서는 users의 상태가 변하기도 한다. users.pop();이 일어나 기존에 찾았던 유저정보가 없어질 수도 있는 것이다.

```jsx
users.pop();
users.pop();
const r2 = fg(2); // Uncaught TypeError
```

따라서 위  함수 자체는 완벽하게 코드가 동작하지만, 함수 합성 과정에서 위험한 상황이 발생할수도 있는 것이다. Kleisli Composition 은 위와 같은 상황에서도 에러가 발생하지 않도록 프로그래밍하는 함수 합성 방법이다.

그렇게 함수를 합성하려면 코드를 어떻게 변경해야 할까? Promise를 조합한다.

```jsx
const fg = id => Promise.resolve(id).then(g).then(f).catch(a => a);
fg(2).then(log); // bb

// 외부 세상에 영향이 생긴 경우
setTimeout(function () {
  users.pop();
  users.pop();
	f(g(2)); // undefined
	g(2); // Promise {<rejected>: "없어요!"}
  fg(2).then(log); // 없어요! : catch(a => a); 실행ㅇ
}, 10);
```

위와 같이 fg 함수를 then과 catch로 구성하면 이후 예상치 못한 users 정보가 들어와 에러가 발생하더라도 unedfined나 에러를 발생시키지 않고 없어요! 라는 값을 반환하도록 만들 수 있는 것이다.

Promsie로 Kleisli Composition을 구현할 수 있다는 점은 바로 이런 것을 의미한다. 🥸
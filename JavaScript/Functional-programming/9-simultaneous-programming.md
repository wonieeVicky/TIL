# 비동기: 동시성 프로그래밍

### callback과 Promise

자바스크립트에서 비동기 동시성 프로그래밍을 하는 방법은 크게 두가지가 있다. 오랫동안 사용되어 왔던 콜백 패턴과 Promise를 기반으로 함수를 합성하는 방법, Promise에서 발전된 async ~ await으로 구현하는 방법이다.

먼저 콜백방식에 대해 살펴보고 Promise와 콜백 방법의 차이점, 함수형 프로그래밍과 Promise와의 조합에 대해 논해보자

먼저 콜백패턴에 대해 알아보자 add10 함수는 100ms 이후에 동작을 실행하는 함수를 만들고자 한다.

```jsx
function add10(a, callback) {
  setTimeout(() => callback(a + 10), 100);
}
add10(5, (res) => {
  add10(res, (res) => {
    add10(res, (res) => {
      log(res);
    });
  });
}); // 300ms 후 35
```

위 함수를 Promise를 통해 구현하면 아래와 같다.

```jsx
function add20(a) {
  return new Promise((resolve) => setTimeout(() => resolve(a + 20), 100));
}
add20(5).then(add20).then(add20).then(log); // 300ms 후 65
```

같은 기능을 하는 함수를 콜백함수와 Promise로 나누어 구현했을 때 콜백함수의 경우 함수 내 중첩 함수가 많아져 Promise 구조에 비해 복잡하여 가독성이 떨어지는 것을 알 수 있다.

### 비동기를 값으로 만드는 Promise

Promise와 콜백은 사용 시 구조의 차이도 있지만 가장 중요한 차이는 어떻게 결과를 꺼내어 보느냐가 아니다. (즉, 콜백지옥과 then으로 가독성 높게 보는 것이 중요한 것이 아니다.)

Promise와 콜백함수의 가장 중요한 차이는 비동기 상황을 일급 값으로 다룬다는 점이다. Promise는 Promise라는 클래스를 통해 만들어진 인스턴스를 반환하는데, 그 반환값은 `대기`, `성공`, `실패`를 다루는 일급 값으로 이루어져 있다. 즉, "대기되어지고 있다"는 값을 만든다는 점에서 콜백과 큰 차이를 가지는 것이다.

이 점을 정확히 떠올리면서 프로그래밍을 할 줄 알면 그에 따른 응용할 수 있는 아이디어가 많아지므로 주의깊게 살펴볼 필요가 있다. 위 add20 함수의 경우 비동기 상황에 대한 값을 만들어 리턴한다는 점이 중요한 것이다..!

위 add10과 add20에 대한 결과값을 보자

```jsx
var a = add10(5, (res) => {
  add10(res, (res) => {
    add10(res, (res) => {
      log(res);
    });
  });
});
log(a); // undefined

var b = add20(5).then(add20).then(add20).then(log); // Promise {<pending>}

add10(5, (_) => _); // undefined
add20(5, (_) => _); // Promise {<pending>}
```

add10과 Promise를 사용한 add20의 가장 큰 차이는 위와 같이 Promise에 대한 결과값을 즉시 반환한다는 점이다. 이 때문에 그 이후에 원하는 어떤 일들을 쉽게 다룰 수 있게된다. add10은 함수 실행이 끝난 후 어떤 것도 실행할 수 없지만 add20의 경우 실행이 완료된 후 원하는 일을 추가적으로 할 수 있게되는 것이다.

```jsx
var step1 = add20(5, (_) => _); // Promise {<pending>}
step1; // Promise {<resolved>: 25}
var step2 = step1.then((a) => a - 5);
step2; // Promise {<resolved>: 20}
var step3 = step2.then((a) => a * 10);
step3; // Promise {<resolved>: 200}
```

즉, 비동기로 일어난 상황에 대해 값으로 다룰 수 있고, 값으로 다룰 수 있다는 것은 즉 일급이라는 것이고, 일급이라는 것은 어떤 변수에 할당되거나, 어떤 함수에 전달되거나, 전달된 값을 가지고 yield를 이어나갈 수 있다는 것을 의미한다. 이는 매우 중요한 차이이다..! ⭐️⭐️⭐️

### 값으로서의 Promise 활용

Promise가 비동기 상황을 값으로 다루는 일급의 성질을 가지고 있다는 점을 활용해 다양한 것들을 할 수 있다.
효과적으로 코드를 정리하고 좋은 로직을 만드는데 있어서 필요한 좋은 함수를 많이 만들어볼 수 있다.

아래 예제코드를 보자

```jsx
const go1 = (a, f) => f(a);
const add5 = (a) => a + 5;

log(go1(10, add5)); // 15
```

위 `go1` 함수가 정상적으로 동작하기 위해서는 몇가지 전제 조건이 필요하다. 먼저 `f`라는 함수가 동기적으로 동작하는 함수여야 하고, a라는 값 역시 동기적으로 바로 값을 알 수 있는 상태여야 한다. 즉 비동기 상황이 일어난 일급 값이 아닌 일반 값이 들어와야 해당 함수가 정상적으로 실행될 수 있다는 것을 의미한다.

그럼 만약 해당 값이 비동기 코드로 받아오는 값이 된다면 어떻게 될까?
당연히 아래처럼 정상적인 실행이 되지 않을 것이다.

```jsx
log(go1(Promise.resolve(10), add5)); // [object Promise]5

// 100ms 후에 받은 값을 리턴하는 함수
const delay100 = (a) => new Promise((resolve) => setTimeout(() => resolve(a), 100));
log(go(delay100(10), add5)); // [object Promise]5
```

위 코드도 정상적으로 실행될 수 있도록 `go1` 함수를 다형성을 지원하도록 변경해보자

```jsx
const go1 = (a, f) => a instanceof Promise ? a.then(f) : f(a);

var r = go1(10, add5);
log(r); // 15

var r2 = go1(delay100(10), add5)); // Promise {<pending>} - [[PromiseValue]]: 15
r2.then(log); // 15
```

위와 같이 변경하면 값 15를 만들 수 있는 상태가 만들어진다. `r`과 `r2`가 동일한 역할을 하게 되는 것이다.
위 함수는 아래와 같이 리팩토링을 할 수 있다.

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

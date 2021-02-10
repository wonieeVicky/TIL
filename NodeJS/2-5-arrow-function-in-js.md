# 화살표 함수

- add1, add2, add3, add4는 같은 기능을 하는 함수

```jsx
function add1(x, y) {
  return x + y;
}
// add2: add1을 화살표 함수로 나타낼 수 있음
const add2 = (x, y) => {
  return x + y;
};
// add3: 함수의 본문이 return만 있는 경우 return 생략
const add3 = (x, y) => x + y;
// add4: return이 생략된 함수의 본문을 소괄호로 감싸줄 수 있음
const add4 = (x, y) => x + y;
// not1과 not2도 같은 기능을 한다
function not1(x) {
  return !x;
}
// 단, 매개변수 하나일 때 괄호 생략 가능
const not2 = (x) => !x;
```

- 리턴 데이터가 객체일 경우 아래와 같은 이슈가 있다.
  - 객체를 리턴할 때에는 반드시 소괄호로 묶어주어야 한다.

```jsx
const obj = (x, y) => {
  return { x, y };
};
// 아래와 같이 바꾸면 함수가 객체를 반환하는 것인지, 함수의 body를 의미하는 건지 구분하지 못한다.
const obj = (x, y) => {
  x, y;
};
// 따라서 객체를 리턴하는 경우에는 소괄호가 필수이다.
const obj = (x, y) => ({ x, y });
```

- 화살표 함수가 기존 function(){}을 대체하는 것은 아니다(this가 달라지므로)
  - logFriends 메서드의 this 값에 주목
  - forEach의 function의 this와 logFriends의 this는 다르다.
  - that이라는 중간 변수를 이용해서 logFriends의 this를 전달

```jsx
var relationship1 = {
  name: "vicky",
  friends: ["wonny", "amy", "tommy"],
  logFriends: function () {
    var that = this;
    // 바깥 부모의 this.friends와 함수 내부의 this.name이 다르다.
    // 따라서 relationship1을 가리키는 this를 that에 별도로 저장해준다.
    this.friends.forEach(function (friend) {
      console.log(that.name, friend);
    });
  },
};

relationshop1.logFriends();
```

```jsx
var relationship1 = {
  name: "vicky",
  friends: ["wonny", "amy", "tommy"],
  logFriends: function () {
    // 아래와 같이 화살표 함수를 사용할 경우 바깥의 this와 내부의 this가 동일하므로
    // 모든 값을 호출할 수 있다. this를 사용하지 않는 경우에 사용하면 좋겠다.
    this.friends.forEach((friend) => {
      console.log(that.name, friend);
    });
  },
};

relationshop1.logFriends();
```

- 따라서 함수 내에 자신만의 this를 가져야하는 경우(버튼 이벤트 등) 기존 함수 방식을 유지하는 것이 좋다.

```jsx
// this를 활용하는 경우
button.addEventListener("click", function () {
  console.log(this.textContent);
});

// event를 사용하는 경우
button.addEventListener("click", (e) => {
  console.log(e.target.value);
});
```

# Promise, async/await

### 8-1. 콜백 헬이라고 불리는 지저분한 자바스크립트 코드의 해결책

- 프로미스: 내용이 실행은 되었으나 결과를 아직 반환하지 않은 객체
- then을 붙이면 결과를 반환한다.
  - 실행이 완료되지 않았으면 완료된 후에 then 내부 함수가 실행된다.
  - resolve(성공 리턴 값) → then으로 연결
- catch를 붙이면 에러 발생시 에러를 반환한다.
  - reject(실패 리턴 값) → catch로 연결
- finally 부분은 무조건 실행된다.

```jsx
const condition = true; // true면 resolve, false면 reject
const promise = new Promise((resolve, reject) => {
	if(condition)[
		resolve('success');
	} else {
		reject('fail');
	}
});

// 다른 코드가 들어갈 수 있음
promise.then((message) => {
	console.log(message); // success
}).catch((error) => {
	console.log(err); // fail
}).finally(() => {
	console.log('무조건')
});
```

- Promise의 장점 !

### 8-2. 콜백 패턴(3중첩)을 프로미스로 바꾸는 예제

- 기존패턴

```jsx
function findAndSaveUser(Users) {
  Users.findOne({}, (err, user) => {
    // 첫번째 콜백
    if (err) {
      return console.error(err);
    }
    user.name = "vicky";
    user.save((err) => {
      // 두번째 콜백
      if (err) {
        return console.error(err);
      }
      Users.findOne({ gender: "w" }, (err, user) => {
        // 세번째 콜백
        // 생략
      });
    });
  });
}
```

- 프로미스를 적용한 코드
  - findOne, save 메서드가 프로미스를 지원한다고 가정
  - 아래와 같은 코드도 100% 좋은 코드라고 볼 수 없다. 콜백 프로미스 같은 너낌.. (8-4로 가자)

```jsx
function findAndSaveUser(Users){
	Users.findOne({}).then((user) => {
		user.name = 'vicky';
		return user.save();
	}).then((user) => {
		return Users.findOne({ gender: 'w' });
	}).then((user => {
		// 생략
	}).catch(err => {
		 console.error(err);
	});
}
```

### 8-3. Promise.resolve, Promise.reject

- Promise.resolve(성공리턴값): 바로 resolve하는 프로미스
- Promise.reject(실패리턴값): 바로 reject하는 프로미스
- `Promise.all(배열)`: 여러 개의 프로미스를 동시에 실행
  - 하나라도 실패하면 catch로 간다.
- `Promise.allSettled(배열)`로 실패한 것만 추려낼 수 있다.

```jsx
const promise1 = Promise.resolve("success1");
const promise2 = Promise.resolve("success2");

Promise.all([promise1, promise2])
  .then((result) => {
    console.log(result); // ['success1', 'success2']
  })
  .catch((err) => {
    console.error(err);
  });
```

### 8-4. async / await

- 프로미스 패턴 코드 내에 async/await 으로 한번 더 축약이 가능하다.
- async function의 도입 ⇒ await이 then역할을 한다.
  - 변수 = await 프로미스; 인 경우 프로미스가 resolve된 값이 변수에 저장
  - 변수 await 값; 인 경우 그 값이 변수에 저장

```jsx
async function returnName() {
  const result = await promise;
  return "vicky";
}

// 이름 값 도출 방법 1
returnName().then((res) => {
  console.log(res); // vicky
});

// 이름 값 도출 방법 2 : top level await function 을 사용하여 구현
const name = await returnName();
console.log(name); // vicky
```

- 8-2 프로미스를 적용한 코드를 한번 더 개선해보자

```jsx
// 개선1: async 함수 안에 await 프로미스를 반환하는 형태로 구성
async function findAndSaveUser(Users) {
  try {
    let user = await Users.findOne({});
    user.name = "vicky";
    user = await user.save();
    user = await Users.findOne({ gender: "w" });
  } catch (error) {
    console.error(error);
  }
}

// 개선2: top level await function 을 활용한 코드
const user = await Users.findOne({});
user.name = "vicky";
user = await user.save();
user = await Users.findOne({ gender: "w" });
```

- 화살표 함수도 async/await 사용 가능

```jsx
const findAndSaveUser = async (Users) => {
  try {
    let user = await Users.findOne({});
    user.name = "vicky";
    user = await user.save();
    user = await Users.findOne({ gender: "w" });
  } catch (err) {
    console.error(err);
  }
};
```

### 8-5. for await of

- **프로미스를 반복할 때 사용하는 문법**이다
  - 노드 10부터 지원
- for await (변수 of 프로미스 배열)
  - resolve된 프로미스가 변수에 담겨 나옴
  - await을 사용하기 때문에 async 함수 안에서 해야한다.
- Promise.allSettled와 비슷해보이지만 다르다.
  - allSettled는 나열된 Promise모음이 모두 이행하거나 거부했을 때에 대한 대응을 할 수 있는 각 **Promise 객체를 반환**
  - for await of는 **열거한 값(resolve내의 값)을 변수로 반환**

```jsx
const promise1 = Promise.resolve("success1");
const promise2 = Promise.resolve("success2");

(async () => {
  for await (promise of [promise1, promise2]) {
    console.log(promise); // resolve 변수가 반환된다.
  }
})();
```

# 3. global과 콘솔, 타이머

> 외우지 말고, 이해하고 넘어가자..! 이런게 있구나 : )

## 3-1. 노드 내장 객체 알아보기

1. global
   - 노드의 전역 객체
   - 터미널에 node를 실행하고, global을 치면 각종 이용 가능한 내장 함수들이 나온다.
     - 브라우저의 window 같은 역할(요즘 브라우저와 노드 둘 모두 globalThis로도 가능, IE빼고..)
     - 모든 파일에서 접근 가능
     - window처럼 생략도 가능(console, require도 global의 속성)
2. global 속성

   - global 속성에 값을 대입하면 다른 파일에서도 사용 가능
   - 양이 많아지면 어디에서 global 선언을 했는지 코득 파악이 어려워지므로 웬만하면 모듈로 만들 것

   ```jsx
   // globalA.js
   module.exports = () => global.message;
   ```

   ```jsx
   // globalB.js
   const A = require("./globalA");

   global.message = "안녕하세요";
   console.log(A());
   ```

   ```jsx
   $ node globalB
   안녕하세요
   ```

3. console 객체

   - 브라우저의 console 객체와 매우 유사
     - console.time, console.timeEnd: 시간 로깅, (코드 수행 타임 체크를 위해 사용)
     - console.error: 에러 로깅
     - console.log: 평범한 로그
     - consolel.dir: 객체 로깅
     - console.trace: 호출스택 로깅

   ```jsx
   const string = "ab";
   const number = 1;
   const boolean = true;
   const obj = {
     outside: {
       inside: {
         key: "value",
       },
     },
   };

   console.time("전체 시간");
   console.log("평범한 로그");
   console.log(string, number, boolean);
   console.error("에러 메시지는 console.error에 담자");
   console.table([
     { name: "vicky", age: 32 },
     { name: "joy", age: 31 },
   ]);
   console.dir(obj, { colors: false, depth: 2 });
   console.dir(obj, { colors: true, depht: 1 });

   console.time("시간 측정");
   for (let i = 0; i < 100000; i++) {
     // codes...
   }
   console.timeEnd("시간 측정");

   function b() {
     console.trace("에러 위치 추적");
   }
   function a() {
     b();
   }
   a();
   ```

4. 타이머 메서드

   - set 메서드에 clear 메서드가 대응된다

     - set 메서드의 리턴 값(아이디)을 clear 메서드에 넣어 취소
     - setTimeout(콜백함수, 밀리초): 주어진 밀리초(1000분의 1초) 이후에 콜백 함수를 실행한다.
       - clearTimeout(아이디): setTimeout을 취소한다.
     - setInterval(콜백함수, 밀리초): 주어진 밀리초마다 콜백 함수를 반복 실행한다.
       - clearInterval(아이디): setInterval을 취소한다.

     ```jsx
     const hello = setInteval(() => console.log("hi"), 2000);
     clearInterval(hello);
     ```

     - setImmediate(콜백 함수): 콜백 함수를 즉시 실행한다.
       - clearImmediate(아이디): setImmediate를 취소한다.
       - setTimeout(()⇒{}, 0)과 뭐가 차이가 있지? 호출 순서에서 약간의 차이가 있다.
       - 뭐하러 즉시 실행을 넣을까?
         일부 코드가 background에서 동시에 실행되도록 보내는 비동기 코드이다.

   - 아래의 코드가 어떻게 결과가 나올지 예상해보자!

     ```jsx
     const timeout = setTimeout(() => {
       console.log("1.5초 후 실행");
     }, 1500);

     const interval = setInterval(() => {
       console.log("1초마다 실행");
     }, 1000);

     const timeout2 = setTimeout(() => {
       console.log("실행되지 않는다");
     }, 3000);

     setTimeout(() => {
       clearTimeout(timeout2);
       clearTimeout(interval);
     }, 2500);

     const immediate = setImmediate(() => {
       console.log("즉시 실행");
     });

     const immediate2 = setImmediate(() => {
       console.log("실행되지 않는다");
     });

     clearImmediate(immediate2);
     // immediate2가 실행되지 않는 이유?
     // setImmediate는 바로 실행되는 것이 아니라
     // Background -> task queue -> event loop에 의하여 호출 스택으로 가기 때문에 취소됨
     ```

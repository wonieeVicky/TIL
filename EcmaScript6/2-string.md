## 2. String

### ES2015 String에 새로운 메서드들

```jsx
let str = "hello world ! ^^~";
let matchstr = "hello";
let matchstr2 = "^~";

// 특정 문자열로 시작하는지 확인하는 메서드
console.log(str.startsWith(matchstr)); // true

// 특정 문자열로 끝나는지 확인하는 메서드
console.log(str.endsWith(matchstr2)); // true

// 특정 문자열이 포함되는지 확인하는 메서드
console.log(str.includes("world")); // true
```
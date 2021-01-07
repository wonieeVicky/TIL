## 11. module

### module(export & import)의 이해

`module` 개념을 서비스에 사용하려면 webpack 기반의 ES5로의 트랜스파일링 babeling 과정이 필요하다.

```jsx
// myLogger.js
function log(data) {
  console.log(data);
}

export default log;
```

```jsx
// app.js
import log from "./myLogger";

const root = document.querySelector("#root");
root.innerHTML = `<p>Hello World</p>`;

log("vicky test"); // vicky test
```

### module(export & import) 기반 서비스코드 구현방법

```jsx
// CodeSquad.js
/* Class */
export default class CodeSquad {
  constructor(props) {
    this.lectures = ["java", "iOS"];
  }

  getLectures() {
    return this.lectures;
  }

  getCurrentHour() {
    return new.Date.getHours();
  }

  getTime() {
    return Date.now();
  }
}
```

```jsx
/* utility.js */
const _ = {
  log(data) {
    if (window.console) console.log(data);
  },
};

export default _;
```

```jsx
// app.js
import CodeSquad from "./CodeSquad";
import _ from "./utility";

_.log("vicky test"); // vicky test
const cs = new CodeSquad();
_.log(`current hour is ${cs.getCurrentHour()}`); // current hour is 11
_.log(`lectures of Codesquad are ${cs.getLectures}`); // lectures of Codesquad are java, iOS
```

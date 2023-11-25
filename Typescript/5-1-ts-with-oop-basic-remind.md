## 타입스크립트 리마인드

### TypeScript 는..

Microsoft에서 만든 프로그래밍 언어. 2년간 개발 후 2012/12 릴리즈

Open-source language이며, 자바스크립트 언어의 대체제임

TypeScript는 JavaScript를 베이스로 하는 언어

JavaScript는 dynamically typed 언어로 런타임 에러를 발생시킴

- Prototype-based, Constructor Functions, ES6(class-like)

TypeScript는 statically typed 언어로 compile error를 발생시킴. runtime 이전에 에러를 잡을 수 있다

- class, interface, generics, types를 활용할 수 있어서 OOP를 더 구체적으로 구현할 수 있다.

client-side, server-side에서 모두 사용 가능함 → 어떻게? 타입스크립트 코드를 transcompile해서 쓴다.

- compiler는 ts 자체 제공 compiler나 babel을 활용함

### 왜 배워야 하는가?

1. type 때문에
   - JavaScript는 런타임에서 타입이 결정되므로(dynamically typed) 위험함.
     그러나 TypeScript는 컴파일 시 타입이 결정되므로(statically typed) 즉각적인 에러를 알 수 있다
   - 타입이 언제 결정되느냐에 따라 나뉘는 개발언어
     - dynamically typed
       - python, ruby, lua, php, js
     - statically typed → compiler가 존재
       - ts, scala, java, kotlin, swift, go, c, c++
   - 타입이 없으면 가독성(readability)이 떨어지고, 유지보수가 어렵다.
   - 타입이 있으면 실시간으로 에러 검사를 받을 수 있으므로 안정적 유지보수 및 확장이 가능하다.
2. OOP(객체 지향 프로그래밍) 를 할 수 있어서
   - modern programming paradigm 중 하나
   - OOP는 객체를 위주로 프로그래밍을 해나감. 객체 위주로 코드를 모듈화(modularity) 가능. 원하는 곳에 모듈화를 재사용(reusability)할 수 있으며, 객체 단위의 확장성(extensible) 또한 존재하며, 이를 통해 기존 코드의 문제 해결이나 새로운 기능 추가가 쉽게 가능하므로 유지보수성(maintainability)이 높음
   - 타입을 보장받음으로써 생산성이 높아지고, 양질의 서비스 제공, 빠른 작업 가능

### setup

- vscode 내 Implicit Project config: Strict Null Checks 활성화
- [공식문서](https://www.typescriptlang.org/download) 항상 검토

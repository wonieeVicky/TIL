# 유틸리티 타입 소개

## 유틸리티 타입이란?

우리가 흔히 제네릭(Generic) 타입으로 잘 알고있는 유틸리티 타입은 **이미 정의해 놓은 타입을 변환할 때 사용하기 좋은 타입 문법**이다. 유틸리티 타입을 꼭 쓰지 않더라도 기존의 인터페이스, 제네릭 등의 기본 문법으로 충분히 타입을 변환할 수 있지만 유틸리티 타입을 스면 훨씬 더 간결한 문법으로 타입을 정의할 수 있다. API 성 타입

## 자주 사용되는 유틸리티 타입 알아보기

### Partial

파셜(Partial) 타입은 **특정 타입의 부분 집합을 만족하는 타입을 정의**할 수 있다.

```tsx
interface Address {
  email: string;
  address: string;
}

type MayHaveEmail = Partial<Address>;
const me: MayHaveEmail = {}; // 가능
const you: MayHaveEmail = { email: "hwfongfing@gmail.com" }; // 가능
const all: MayHaveEmail = { email: "hwfongfing@gmail.com", address: "Dongtan" }; // 가능
```

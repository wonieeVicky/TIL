> 더 많은 matcher들은 [요기](https://jestjs.io/docs/expect)를 참고하자 !

## 1. Common Matchers

### - toBe

정확한 값이 일치하는지 여부를 확인한다.

```jsx
test("adds 1 + 2 to equal 3", () => {
  expect(sum(1, 2)).toBe(3);
});
```

### - toEqual

객체(Object)의 값이 일치하는지 여부를 확인한다.

```jsx
test("object assignment", () => {
  const data = { one: 1 };
  data["two"] = 2;
  expect(data).toEqual({ one: 1, two: 2 });
});
```

### - not

해당 값이 아니다. 즉 불일치 여부를 확인한다.

```jsx
test("adding positive numbers is not zero", () => {
  for (let a = 1; a < 10; a++) {
    for (let b = 1; b < 10; b++) {
      expect(a + b).not.toBe(0);
    }
  }
});

test("object assignment", () => {
  const data = { one: 1 };
  data["two"] = 2;
  expect(data).not.toEqual({ one: 1, two: 3 });
});
```

## 2. Truitness(진실성)

undefined, null, false 등의 값을 판별할 때 사용한다.

### - toBeNull

오직 `null`만 판단한다.

### - toBeUndefined

오직 `undefined`만 판단한다.

### - toBeDefined

`toBeUndefined`의 반대인 상황인지 확인한다.

### - toBeTruthy

`if` 문에서 `true`로 취급되는 구문을 확인

### - toBeFalsy

`if` 문에서 `false`로 취급되는 구문을 확인

```jsx
test("null", () => {
  const n = null;
  expect(n).toBeNull();
  expect(n).toBeDefined();
  expect(n).not.toBeUndefined();
  expect(n).not.toBeTruthy();
  expect(n).toBeFalsy();
});

test("zero", () => {
  const z = 0;
  expect(z).not.toBeNull();
  expect(z).toBeDefined();
  expect(z).not.toBeUndefined();
  expect(z).not.toBeTruthy();
  expect(z).toBeFalsy();
});
```

## 3. Numbers

### - toBeGreaterThan

n보다 큰 숫자인지 여부 확인

### - toBeGreaterThanOrEqual

n과 같거나 큰 숫자인지 여부 확인

### - toBeLessThan

n보다 작은 숫자인지 여부 확인

### - toBeLessThanOrEqual

n과 같거나 작은 숫자인지 여부 확인

```jsx
test("two plus two", () => {
  const value = 2 + 2;
  expect(value).toBeGreaterThan(3);
  expect(value).toBeGreaterThanOrEqual(3.5);
  expect(value).toBeLessThan(5);
  expect(value).toBeLessThanOrEqual(4.5);

  // toBe와 toEqual은 숫자나 문자열 조합에서는 동일하다.
  expect(value).toBe(4);
  expect(value).toEqual(4);
});
```

### - toBeCloseTo

`float`(부동소수점) 값의 정합 여부를 따질 때에는 `toEqual` 대신 `toBeCloseTo`를 사용한다.
반올림하는 데 있어서 에러가 발생할 수 있기 때문임

```jsx
test("adding floating point numbers", () => {
  const value = 0.1 + 0.2;
  // expect(value).toBe(0.3); 반올림 이슈로 인해 에러 발생
  expect(value).toBeCloseTo(0.3);
});
```

## 4. string

### - toMatch

정규식을 이용해 문자열의 일치 여부를 확인

```jsx
test("there is no I in team", () => {
  expect("team").not.toMatch(/I/);
});

test('but there is a "stop" in Christoph', () => {
  expect("Christoph").toMatch(/stop/);
});
```

## 5. Arrays and iterables

### - toContain

Array나 iterable한 객체(Set, Map 등)에 특정 요소 포함 여부 확인

```jsx
const todoList = ["typescript", "jest", "functional-programming", "node.js", "swr"];

test("the todo list has jest on it", () => {
  expect(todoList).toContain("jest");
  expect(new Set(todoList)).toContain("jest");
});
```

## 6. Exceptions

### - toThrow

함수 호출 시 에러 발생 여부를 확인한다. 단순한 에러 혹은 특정 에러를 지정할 수 있다.
단, 예외를 발생시키는 함수는 래핑 함수 내에서 호출되어야 함

```jsx
function compileAndroidCode() {
  throw new Error("you are using the wrong JDK");
}

test("compiling android goes as expected", () => {
  expect(() => compileAndroidCode()).toThrow();
  expect(() => compileAndroidCode()).toThrow(Error);

  expect(() => compileAndroidCode()).toThrow("you are using the wrong JDK");
  expect(() => compileAndroidCode()).toThrow(/JDK/);
});
```

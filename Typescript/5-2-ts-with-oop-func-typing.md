## 기본 함수 타이핑

### 계산기

`calculator.ts`

```tsx
/**
 * make a calculator 🧮
 */

type Command = 'add' | 'substract' | 'multiply' | 'divide' | 'remainder';
function calculate(command: Command, a: number, b: number): number {
  switch (command) {
    case 'add':
      return a + b;
    case 'substract':
      return a - b;
    case 'multiply':
      return a * b;
    case 'divide':
      return a / b;
    case 'remainder':
      return a % b;
    default:
      throw Error('unknown command');
  }
}
console.log(calculate('add', 1, 3)); // 4
console.log(calculate('substract', 3, 1)); // 2
console.log(calculate('multiply', 4, 2)); // 8
console.log(calculate('divide', 4, 2)); // 2
console.log(calculate('remainder', 5, 2)); // 1
```

### 좌표게임

`game.ts`

```tsx
/**
 * make a game 🕹
 */

let position = { x: 0, y: 0 };
type Direction = 'up' | 'down' | 'left' | 'right';
function move(direction: Direction) {
  switch (direction) {
    case 'up':
      position.y += 1;
      break;
    case 'down':
      position.y -= 1;
      break;
    case 'left':
      position.x -= 1;
      break;
    case 'right':
      position.x += 1;
      break;
    default:
      throw Error(`unknown direction: ${direction}`);
  }
}

console.log(position); // { x: 0, y: 0}
move('up');
console.log(position); // { x: 0, y: 1}
move('down');
console.log(position); // { x: 0, y: 0}
move('left');
console.log(position); // { x: -1, y: 0}
move('right');
console.log(position); // { x: 0, y: 0}
```

### 로딩 상태 표시

```tsx
/**
 * Print Loading State
 */
type LoadingState = {
  state: 'loading';
};

type SuccessState = {
  state: 'success';
  response: {
    body: string;
  };
};

type FailState = {
  state: 'fail';
  reason: string;
};

type ResourceLoadState = LoadingState | SuccessState | FailState;

function printLoginState(state: ResourceLoadState) {
  switch (state.state) {
    case 'loading':
      console.log('👀 loading...');
      break;
    case 'success':
      console.log(`😃 ${state.response.body}`);
      break;
    case 'fail':
      console.log(`😱 ${state.reason}`);
      break;
    default:
      throw new Error(`unknown state: ${state}`);
  }
}

printLoginState({ state: 'loading' }); // 👀 loading...
printLoginState({ state: 'success', response: { body: 'loaded' } }); // 😃 loaded
printLoginState({ state: 'fail', reason: 'no network' }); // 😱 no network
```

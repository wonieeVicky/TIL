## 에러 처리

### 에러처리

프로그래밍에서 에러처리는 중요하다! exception handling은 잘 관리한다면 우리에게 큰 도움이 된다.
어플리케이션을 운영하다보면 다양한 exception이 발생함, 이를 잘 관리하면 안정성과 유지보수성이 높아짐

- 어플리케이션 내부에서 예상이 가능한 에러 = Error
- 예상치 못한 이슈를 뜻하며 = Exception

### Error에 대하여

```tsx
function move(direction: 'up' | 'down' | 'left' | 'right') {
  switch (direction) {
    case 'up':
      break;
    case 'down':
      break;
    case 'left':
      break;
    case 'right':
      break;
    default:
      throw new Error('unknown direction: ' + direction);
  }
}
```

위와 같은 move 함수가 있다고 했을 때 direction은 4개의 값으로 가둬짐. 만약 아래와 같다면?

```tsx
function move(direction: 'up' | 'down' | 'left' | 'right' | 'he') {
  switch (direction) {
    case 'up':
      break;
    case 'down':
      break;
    case 'left':
      break;
    case 'right':
      break;
    default:
      const invalid: never = direction; // 'string' 형식은 'never' 형식에 할당할 수 없습니다. direction = 'he'로 추론..
      throw new Error('unknown direction: ' + invalid);
  }
}
```

`he`라는 타입이 direction에 추가되고 invalid 변수에 never 타입을 넣는다면 에러가 발생함.

```tsx
function move(direction: 'up' | 'down' | 'left' | 'right' | 'he') {
  switch (direction) {
    case 'up':
      break;
    case 'down':
      break;
    case 'left':
      break;
    case 'right':
      break;
    // he 케이스를 고려
    case 'he':
      break;
    default:
      const invalid: never = direction; // Ok
      throw new Error('unknown direction: ' + invalid);
  }
}
```

아래와 같이 he 케이스가 switch 문에서 미리 고려될 경우에는 invalid 케이스는 never 타입이 맞기 때문에 별도의 에러가 발생하지 않는다.

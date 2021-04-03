# Todo App 간단 타이핑

타이핑(typing) : 타입이 정의되지 않은 코드에 타입을 입혀주는 행위

진행하기 앞서 `tsconfig.json`을 살펴보자

```json
{
  "compilerOptions": {
    "allowJs": true,
    "checkJs": true,
    "noImplicitAny": false
  },
  "include": ["./src/**/*"]
}
```

`compilterOptions`의 경우 ts → js로 변환하는 과정의 설정인데, `noImplicitAny`를 true로 설정하면 반드시 타이핑을 해야하는 부분이 ts 파일에 빨간색 밑줄로 표시된다. 만약 활성화 한 상태에서 컴파일 했을 때 빨간색 오류가 있으면 컴파일이 완료되지 않는다.

변경할 JS Todo 앱은 아래와 같다.

```jsx
let todoItems;

// api
function fetchTodoItems() {
  const todos = [
    { id: 1, title: "안녕", done: false },
    { id: 2, title: "타입", done: false },
    { id: 3, title: "스크립트", done: false },
  ];
  return todos;
}

// crud methods
function fetchTodos() {
  const todos = fetchTodoItems();
  return todos;
}

function addTodo(todo) {
  todoItems.push(todo);
}

function deleteTodo(index) {
  todoItems.splice(index, 1);
}

function completeTodo(index, todo) {
  todo.done = true;
  todoItems.splice(index, 1, todo);
}

// business logic
function logFirstTodo() {
  return todoItems[0];
}

function showCompleted() {
  return todoItems.filter((item) => item.done);
}

function addTwoTodoItems() {
  // TODO: addTodo() 함수를 두 번 호출하여 todoItems에 새 할 일이 2개 추가할 것
}

// NOTE: 유틸 함수
function log() {
  console.log(todoItems);
}

todoItems = fetchTodoItems();
addTwoTodoItems();
log();
```

위 JS Todo 앱에 타이핑을 하면 아래와 같이 만들 수 있다.

```tsx
interface Todo {
  id: number;
  title: string;
  done: boolean;
}

let todoItems: Todo[];

// api
function fetchTodoItems(): Todo[] {
  const todos = [
    { id: 1, title: "안녕", done: false },
    { id: 2, title: "타입", done: false },
    { id: 3, title: "스크립트", done: false },
  ];
  return todos;
}

// crud methods
function fetchTodos(): object[] {
  const todos = fetchTodoItems();
  return todos;
}

function addTodo(todo: Todo): void {
  todoItems.push(todo);
}

function deleteTodo(index: number): void {
  todoItems.splice(index, 1);
}

function completeTodo(index: number, todo: Todo): void {
  todo.done = true;
  todoItems.splice(index, 1, todo);
}

// business logic
function logFirstTodo(): object {
  return todoItems[0];
}

function showCompleted(): object[] {
  return todoItems.filter((item) => item.done);
}

function addTwoTodoItems(): void {
  addTodo({ id: 4, title: "호", done: false });
  addTodo({ id: 5, title: "몰랑", done: false });
}

// NOTE: 유틸 함수
function log(): void {
  console.log(todoItems);
}

todoItems = fetchTodoItems();
addTwoTodoItems();
log();
```

1. 자주 사용하는 타입은 Todo 라는 인터페이스로 정의하고 붙여넣었다.  
   Todo[] : Todo 객체 프로퍼티가 포함된 배열형식의 데이터라는 의미이다.
2. `:void` 반환될 데이터가 없을 때 사용해준다.
3. `:any` 모든 타입을 허용할 경우 any를 선택한다. 타입 지정을 하지 않으면 타입 추론 시 any로 지정됨

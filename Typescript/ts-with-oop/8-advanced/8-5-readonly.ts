{
  type Todo = {
    title: string;
    description: string;
  };

  function display(todo: Readonly<Todo>) {
    // todo.title = 'jaja'; // 가변성으로 불변성에 위배
  }
}

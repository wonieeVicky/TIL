{
  type Todo = {
    title: string;
    description: string;
    label: string;
    priority: 'high' | 'low';
  };

  function updateTodo(todo: Todo, fieldsToUpdated: Partial<Todo>): Todo {
    return { ...todo, ...fieldsToUpdated };
  }
  const todo: Todo = {
    title: 'learn TypeScript',
    description: 'learn utility types',
    label: 'study',
    priority: 'high'
  };
  const updated = updateTodo(todo, { priority: 'low' });
  console.log(updated);
  /*
    {
      title: 'learn TypeScript',
      description: 'learn utility types',
      label: 'study',
      priority: 'low'
    }
  */
}

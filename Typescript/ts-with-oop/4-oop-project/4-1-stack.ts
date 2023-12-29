{
  // 인터페이스로 정의해서 좋은 이유?
  // 스택을 사용하는 사람들이 나중에 스택을 사용하거나 다른 스택을 사용할 때
  // 사용하는 방법을 쉽게 알 수 있게 해준다.
  interface Stack {
    readonly size: number;
    push(value: string): void;
    pop(): string;
  }

  type StackNode = {
    readonly value: string;
    readonly next?: StackNode;
  };

  class StackImpl implements Stack {
    private _size: number = 0; // 내부에서 사용하는 변수임을 _로 표현
    private head?: StackNode;
    constructor(private capacity: number) {}

    get size() {
      return this._size;
    }

    push(value: string) {
      if (this.size === this.capacity) {
        throw new Error('Stack is full!');
      }
      const node: StackNode = {
        value,
        next: this.head
      };
      this.head = node;
      this._size++;
    }

    pop(): string {
      // null == undefined, null !== undefined
      if (this.head == null) {
        throw new Error('Stack is empty');
      }
      const node = this.head;
      this.head = node.next;
      this._size--;
      return node.value;
    }
  }

  const stack = new StackImpl(5); // max capacity = 5
  stack.push('Vicky1');
  stack.push('Vicky2');
  stack.push('Vicky3');
  while (stack.size !== 0) {
    console.log(stack.pop());
  }
  console.log(stack.pop()); // error
}

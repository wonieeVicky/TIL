{
  class Stack {
    private data: string = '';
    constructor() {
      this.data = '';
    }

    push(item: string) {
      this.data.length === 0 ? (this.data = item) : (this.data += `, ${item}`);
    }

    pop() {
      this.data = this.data.split(', ').slice(0, -1).join(', ');
    }

    size() {
      return this.data.split(', ').length;
    }
  }
  const stackInstance = new Stack();
  stackInstance.push('a');
  console.log(stackInstance);
  stackInstance.push('b');
  console.log(stackInstance);
  stackInstance.push('c');
  console.log(stackInstance);
  stackInstance.pop();
  console.log(stackInstance);
  console.log(stackInstance.size());
}

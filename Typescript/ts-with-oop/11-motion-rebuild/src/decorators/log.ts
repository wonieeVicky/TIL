function Log(
  _: any,
  name: string,
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  const newDescriptor = {
    ...descriptor,
    value: function (...args: any[]): any {
      console.log(`Calling ${name} with arguments.`);
      const start = performance.now();
      const result = descriptor.value.apply(this, args);
      const end = performance.now();
      console.log(`${name} (${args}) took ${end - start} ms`);
      console.log(`result: ${result}`);
      return result;
    }
  };

  return newDescriptor;
}

class Calculator {
  @Log
  add(x: number, y: number) {
    return x + y;
  }
}

const calculator = new Calculator();
console.log(calculator.add(2, 3));

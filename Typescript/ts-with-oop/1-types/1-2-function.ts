{
  // JavaScript 💩
  // function jsAdd(num1, num2) {
  //   return num1 + num2;
  // }
  // TypeScript ✨
  function tsAdd(num1: number, num2: number): number {
    return num1 + num2;
  }

  // JavaScript 💩
  // function jsFetchNum(id) {
  //   // code ...
  //   // code ...
  //   return new Promise((resolve, reject) => {
  //     resolve(100);
  //   });
  // }
  // TypeScript ✨
  function jsFetchNumber(id: string): Promise<number> {
    // code ...
    // code ...
    return new Promise((resolve, reject) => {
      resolve(100);
    });
  }

  // JavaScript ✨ => TypeScript
  // Optional parameter - 물음표를 붙여서 사용
  function printName(firstName: string, lastName?: string) {
    console.log(firstName);
    console.log(lastName);
  }
  printName('Vicky', 'Jobs');
  // Vicky
  // Jobs
  printName('Wonny');
  // Wonny
  // undefined
  printName('Anna', undefined);
  // Anna
  // undefined

  // function printName2(firstName: string, lastName: string | undefined) {
  //   console.log(firstName);
  //   console.log(lastName);
  // }
  // printName2('Vicky', 'Jobs');
  // printName2('Wonny'); // type error!
  // printName2('Anna', undefined);

  // Default parameter - 기본값을 설정
  function printMessage(message: string = 'default message') {
    console.log(message);
  }
  printMessage(); // default message
  printMessage('hello'); // hello

  // Rest parameter - 배열 형태로 전달
  function addNumbers(...numbers: number[]): number {
    return numbers.reduce((a, b) => a + b);
  }
  console.log(addNumbers(1, 2, 3)); // 6
  console.log(addNumbers(1, 2, 3, 4, 5)); // 15
  console.log(addNumbers(1)); // 1
}

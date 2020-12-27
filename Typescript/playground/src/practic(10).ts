// 10. 클래스
//클래스 바디(Class body)에 별도로 타입을 선언하는 클래스 속성(properties)
// {} 중괄호에 묶여있는 영역을 의미함

class Animal {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}
class Cat extends Animal {
  getName(): string {
    return `Cat name is ${this.name}.`;
  }
}
let cat: Cat;
cat = new Cat('Nana');
console.log(cat.getName()); // Cat naem is Nana

## 클래스(Class)

### 1) 클래스 속성(Properties)

클래스의 생성자 메소드(`constructor`)와 일반 메소드(Methods) 멤버(Class member)와는 다르게,  
속성(Properties)은 `name: string;`와 같이 클래스 바디(Class body)에 별도로 타입을 선언한다.

> 클래스 바디(Class body)는 중괄호 `**{}**`로 묶여있는 영역을 의미한다.

```tsx
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
```

### 2) 클래스 수식어(Modifiers)

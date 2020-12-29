// 10. 클래스
//2. 클래스 바디(Class body)
// 클래스 바디(Class body)에 별도로 타입을 선언하는 클래스 속성(properties)
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
 
// 1) 클래스 수식어(Modifiers)
// 접근 제어자가 public인 경우
class Animal {
    public name: string;
    constructor(name: string) {
        this.name = name;
    }
}
class Cat extends Animal {
    getName(): string {
        return `Cat name is ${this.name}`;
    }
}

let cat = new Cat('Nana')
console.log(cat.getName()); // Cat name is Nana
cat.name = ''Lucy
console.log(cat.getName()); // Cat name is Lucy

// 접근 제어자가 private 경우
class Animal {
    private name: string;
    constructor(name: string) {
        this.name = name;
    }
}
class Cat extends Animal {
    getName(): string {
        return `Cat name is ${this.name}`; // Error - TS2341: Property 'name' is private and only accessible within class 'Animal'
    }
}
let cat = new Cat("Nana");
console.log(cat.getName()); // Cat name is Nana
console.log(cat.name); // Error - TS2341: Property 'name' is private and only accessible within class 'Animal'.

cat.name = "Lucy"; // Error - TS2341: Property 'name' is private and only accessible within class 'Animal'.
console.log(cat.getName());

// 접근 제어자가 protected인 경우
class Animal {
    name: string;
    protected constructor(name: string) {
        this.name = name;
    }
}
const cat = new Animal('Dog'); // Error - TS2674: Constructor of class 'Animal' is protected and only accessible within the class declaration.


// 생성자 메소드에서 인수 타입 선언과 동시에 접근 제어자 사용시 속성멤버로 정의가능
class Cat {
    constructor(public name: string, protected age: number) {}
    getName() {
        return this.name;
    }
    getAge() {
        return this.age;
    }
}

const cat = new Cat("Nana", 2);
console.log(cat.getName()); // Nana
console.log(cat.getAge()); // 2 

// 정적 속성이 static인 경우
class Cat {
    static legs: number;
    constructor() {
        Cat.legs = 4; // Init static property
    }
}
console.log(Cat.legs); // undefined
new Cat();
console.log(Cat.legs); // 4

class Dog {
    // Init static method
    static getLegs() {
        return 4;
    }
}
console.log(Dog.getLegs()); // 4

// 정적 속성이 readonly인 경우
class Animal {
    readonly name: string;
    constructor(n: string) {
        this.name = n;
    }
}
let dog = new Animal("Salgoo");
console.log(dog.name); // Salgoo
dog.name = "Dodo"; // Error - TS2540: Cannot assign to 'name' because it is a read-only property.

// 접근제어자와 같이 사용하는 static, readonly
class Cat {
    public readonly name: string;
    protected static eyes: number;
    constructor(n: string) {
        this.name = n;
        Cat.eyes = 2;
    }
    private static getLegs() {
        return 4;
    }
}

// 추상(abstract)클래스
// 인터페이스와 유사한 추상 클래스
// 직접 인스턴스 생성할 수 없으므로 파생된 후손 클래스에서 인스턴스를 생성해야 함
abstract class Animal {
    abstract name: string; // 파생된 클래스에서 구현해야 한다.
    abstract getName(): string; // 파생된 클래스에서 구현해야 한다.
}
class Cat extends Animal {
    constructor(public name: string) {
        super();
    }
    getName() {
        return this.name;
    }
}
new Animal(); // Error - TS2511: Cannot create an instance of an abstract class.
const cat = new Cat("Nana");
console.log(cat.getName()); // Nana

// Interface
interface IAnimal {
    name: string;
    getName(): string;
}
class Dog implements IAnimal {
    constructor(public name: string) {}
    getName() {
        return this.name;
    }
}

// 추상클래스는 인터페이스와 달리 속성이나 메소드 멤버에 대한 세부 구현이 가능함
abstract class Animal {
    abstract name: string;
    abstract getName(): string;
    // Abstract class constructor can be made protected.
    protected constructor(public legs: string) {}
    getLegs() {
        return this.legs;
    }
}

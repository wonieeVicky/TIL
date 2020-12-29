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
cat = new Cat("Nana");
console.log(cat.getName()); // Cat naem is Nana
```

### 2) 클래스 수식어(Modifiers)

타입스크립트와 관련된 클래스 수식어들을 살펴보자. 클래스 멤버(속성, 메소드)에서 사용할 수 있는 접근 제어자(Access Modifierse)들이 있다. 각 접근 제어자들의 차이점을 알아보자

> 접근 제어자(Access Modifierse)는 클래스, 메서드 및 기타 멤버의 접근 가능성을 설정하는 객체 지향 언어의 키워드이다.

[접근 제어자](https://www.notion.so/f59693591e3f4a3fb4a5be4759c36a51)

다음 수식어들은 위 접근 제어자와 함께 사용할 수 있다.  
`static` 의 경우 타입스크립트에서는 정적 메소드뿐만 아니라 정적 속성도 사용할 수 있다.

[수식어](https://www.notion.so/fcb83a6690564b778d7a3930fb09d27d)

그럼 우선, 각 접근 제어자들의 차이점에 대해 살펴보자.

아래 예제의 `Animal` 클래스의 `name` 속성은 `public`이기 때문에 파생된 자식 클래스(`Cat`)에서 `this.name`으로 참조하거나 인스턴스에서 `cat.name`으로 접근하는데 아무런 문제가 없다. (어디서나 자유롭게 접근(생략) 가능)

```tsx
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
```

아래 예제의 `Animal` 클래스의 `name` 속성은 `private`이기 때문에 파생된 자식 클래스(`Cat`)에서 `this.name`으로 참조할 수 없고, 인스턴스에서도 `cat.name`으로 접근할 수도 없다. (내 클래스에서만 접근 가능)

```tsx
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
```

다음은 생성자 메소드(constructor)에 protected를 사용했기 때문에 인스턴스 생성에서 에러가 발생하는 예시이다.

```tsx
class Animal {
    name: string;
    protected constructor(name: string) {
        this.name = name;
    }
}
const cat = new Animal("Dog"); // Error - TS2674: Constructor of class 'Animal' is protected and only accessible within the class declaration.
```

그리고 흥미로운 부분은 생성자 메소드에서 인수 타입 선언과 동시에 접근 제어자를 사용하면 바로 속성 멤버로 정의할 수 있다. 접근 제어자를 생략하지 않도록 주의할 것

```tsx
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
```

이번엔 `static`과 `readonly`에 대해 살펴보자.

ES6에서는 `static`으로 정적 메소드만 생성할 수 있었는데, 타입스크립트에서는 **정적 속성**도 생성할 수 있다. 정적 속성은 클래스 바디에서 속성의 타입 선언과 같이 작용하며, 정적 메소드와 다르게 클래스 바디에서 값을 초기화할 수 없기 때문에 `constructor` 혹은 메소드에서 초기화가 필요하다.

```tsx
// 정적 속성을 static으로 생성
class Cat {
    static legs: number;
    constructor() {
        Cat.legs = 4; // Init static property
    }
}
// 속성이므로 바로 읽힐 수 없다.
console.log(Cat.legs); // undefined
new Cat();
console.log(Cat.legs); // 4

// 정적 메서드를 static으로 생성
class Dog {
    // Init static method
    static getLegs() {
        return 4;
    }
}
// 메서드이므로 바로 읽힐 수 있다.
console.log(Dog.getLegs()); // 4
```

`readonly`를 사용하면 해당 속성은 '읽기전용'이다.

```tsx
class Animal {
    readonly name: string;
    constructor(n: string) {
        this.name = n;
    }
}
let dog = new Animal("Salgoo");
console.log(dog.name); // Salgoo
dog.name = "Dodo"; // Error - TS2540: Cannot assign to 'name' because it is a read-only property.
```

static과 readonly는 접근 제어자와 같이 사용할 수도 있다. 대신 접근 제어자를 먼저 작성해야 한다.

```tsx
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
```

### 3) 추상(Abstract) 클래스

추상(Abstract) 클래스는 다른 클래스가 파생될 수 있는 기본 클래스로, 인터페이스와 굉장히 유사하다.
`abstract`는 클래스뿐만 아니라 속성과 메소드에도 사용할 수 있다. 추상 클래스는 직접 인스턴스를 생성할 수 없기 때문에 파생된 후손 클래스에서 인스턴스를 생성해야 한다.

```tsx
// abstract
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
```

추상 클래스가 인터페이스와 다른 점은 속성이나 메소드 멤버에 대한 세부 구현이 가능하다는 점이다.

```tsx
abstract class Animal {
    abstract name: string;
    abstract getName(): string;
    // Abstract class constructor can be made protected.
    protected constructor(public legs: string) {}
    getLegs() {
        return this.legs;
    }
}
```

## 객체지향 프로그래밍(OOP) 개념 이해하기

### 명령형, 절차적 프로그래밍

- 하나의 어플리케이션을 만들 때 그 데이터와 함수를 기준으로 프로젝트를 구성하는 것을 의미함
- 함수가 연관된 함수를 실행시키고, 전역 변수에 접근하여 데이터를 변경할 수 있음
- 단점
  - 여러 함수가 전역적으로 사용되므로, 전체 어플리케이션의 이해도가 필요하며, 예상치 못한 사이드 이펙트가 발생할 가능성이 있음
  - 유지보수 어려움, 확장 어려움

### 객체 지향 프로그래밍(Object-Oriented Programming)

- 객체를 지향하는 컨셉으로 프로그래밍 해나가는 방식
- 객체 지향에 대한 컨셉, 관례에 대해 알아보고 실제 적용해보자
- 프로그램을 객체로 정의하여 객체로 서로 의사소통하도록 설계 및 구성하는 방법을 의미함
- 서로 관련있는 데이터와 함수를 여러 객체로 정의해서 프로그래밍
- 문제 발생 시 관련 객체만 이해하고 수정하면 됨
- 여러번 반복되는 기능은 객체를 그대로 재사용할 수 있음
- 새로운 기능이 필요 시 새로운 객체를 생성해서 확장성이 높아진다.

### Object

- 데이터와 함수로 구성
  - 데이터: fields, property로 통칭
  - 함수: methods로 통칭
  - 만약 MediaPlayer 객체라면?
    - data: music
    - function: play, stop..
- 우리 주변에서 볼 수 있는 다양한 개체들을 선정해서 디자인할 수 있음
  - Error, Exception, Event 도 모두 객체로 정의가능
- class
  - template
    - 데이터 정의가 되지 않음. 정의/묘사만 함
  - declare once
  - no data in
- object
  - instance of a class
    - 클래스에 데이터를 넣은 인스턴스
    - 붕어빵 클래스를 이용해 팥 붕어빵 인스턴스를 생성함
  - created many times
  - data in
- 예시
  - class student
    - name: string, score: number, study().. 등 정의
  - object 생성
    - student Vicky instance 생성
    - student Wonny instance 생성

### 객체지향 원칙

클래스 정의, 객체만 만든다고 해서 객체 지향 프로그래밍이라고 할 수 없다.
객체지향의 원칙을 지켜서 개발하는 것이 가장 중요

객체 지향은 아래의 특성을 가진다.

- 캡슐화(Encapsulation)
  - 흩어져있는 관련있는 객체들을 가두는 것을 캡슐화라고 함.
  - 감기약 캡슐 안에 여러 성분의 약이 있는 것과 같음 → 성분을 보지 않고 그냥 먹기만 하면 됨
  - 서로 관련있는 데이터와 함수를 하나의 오브젝트 안에 담아두고 외부에서 볼 필요가 없는 데이터를 잘 숨겨서 캡슐화를 할 수 있음
  - 고양이
    - hungry, full, tired, happy 는 내부 상태(State)
    - play, feed 라는 외부 function을 통해 내부 상태를 변경할 수 있음
- 추상화(Abstraction)
  - 추상성은 내부의 복잡한 기능을 다 이해하지 않고도 외부에서 다양한 인터페이스를 통해 쓸 수 있도록 하는 것을 의미
  - 커피머신
    - 내부 구조를 모두 이해하지 않아도 기계에서 제공하는 버튼만 누르면 커피를 만들 수 있다.
    - 내부 사정을 몰라도 외부에서만 보이는 인터페이스를 이용해 오브젝트를 사용할 수 있도록 하는 것
- 상속성(Inheritance)
  - 상속을 이용하면 오브젝트를 활용해 다양한 오브젝트를 확장해나갈 수 있음
  - coffee machine 을 상속받아 → coffee brewer, espresso machine 이 된다.
  - animal을 상속받아(makeSound) → cat, dog, pig(makeSound 상속)이 된다.
  - HTMLElement → Document. Element. Text → Node → EventTarget
    - 모든 엘리먼트는 EventTarget을 가짐을 알 수 있다.
  - parent ↔ child, super ↔ sub, base ↔ derived 관계로 불림
- 다형성(Polymorphism)
  - 다양한 형태를 의미함
  - coffee machine.makeCoffee → coffee brewer, espresso machine 등 어떤 커피머신인지 알 필요 없이 공통된 makeCoffee 함수에 접근할 수 있는 것을 의미
  - animal.makeSound → cat, dog, pig 등 어떤 동물인지 알 필요 없이 다양한 형태에 공통된 makeSound 를 실행할 수 있는 것을 의미

### 절차지향적으로 커피머신 만들기

```tsx
{
  type CoffeeCup = {
    shots: number;
    hasMilk: boolean;
  };

  const BEANS_GRAMM_PER_SHOT = 7; // 커피를 내릴 때 필요한 원두의 양
  let coffeeBeans: number = 0;
  function makeCoffee(shots: number): CoffeeCup {
    if (coffeeBeans < shots * BEANS_GRAMM_PER_SHOT) {
      throw new Error('Not enough coffee beans!');
    }
    coffeeBeans -= shots * BEANS_GRAMM_PER_SHOT;

    return {
      shots,
      hasMilk: false
    };
  }

  coffeeBeans += 3 * BEANS_GRAMM_PER_SHOT; // 초기 coffeeBeans 수량 정의
  const coffee = makeCoffee(2);
  console.log(coffee); // { shots: 2, hasMilk: false }
}
```

### 객체지향적으로 커피머신 만들기

```tsx
type CoffeeCup = {
  shots: number;
  hasMilk: boolean;
};

class CoffeeMaker {
  static BEANS_GRAMM_PER_SHOT: number = 7; // 중복적으로 사용되는 변수는 class level로 설정
  coffeeBeans: number = 0; // instance (object) level

  // instance를 만들 때 초기에 항상 호출되는 함수
  constructor(coffeeBeans: number) {
    this.coffeeBeans += coffeeBeans; // this.coffeeBeans !== coffeeBeans
  }

  makeCoffee(shots: number): CoffeeCup {
    if (this.coffeeBeans < shots * CoffeeMaker.BEANS_GRAMM_PER_SHOT) {
      throw new Error('Not enough coffee beans!');
    }

    this.coffeeBeans -= shots * CoffeeMaker.BEANS_GRAMM_PER_SHOT;

    return {
      shots,
      hasMilk: false
    };
  }
}

const makerInstance = new CoffeeMaker(32);
console.log(makerInstance); // CoffeeMaker { coffeeBeans: 32 }
console.log(makerInstance.makeCoffee(2)); // { shots: 2, hasMilk: false }

const makerInstance2 = new CoffeeMaker(14);
console.log(makerInstance2); // CoffeeMaker { coffeeBeans: 14 }
```

위처럼 makeInstance 변수를 생성해서 인스턴스를 생성하는 방법 말고 아래와 같이 만들 수도 있음

```tsx
type CoffeeCup = {
  shots: number;
  hasMilk: boolean;
};

class CoffeeMaker {
  static BEANS_GRAMM_PER_SHOT: number = 7;
  coffeeBeans: number = 0;

  // constructor를 사용하지 않고, static method를 사용하여 instance를 생성
  static makeMachine(coffeeBeans: number): CoffeeMaker {
    return new CoffeeMaker(coffeeBeans);
  }

  makeCoffee(shots: number): CoffeeCup {
    // ..
  }
}

const makerInstance = CoffeeMaker.makeMachine(3);
console.log(makerInstance); // CoffeeMaker { coffeeBeans: 3 }
```

반드시 static method로 makeMachine을 선언해야 외부에서 바로 인스턴스를 생성할 수 있음. 참고

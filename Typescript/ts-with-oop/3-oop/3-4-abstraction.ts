{
  type CoffeeCup = {
    shots: number;
    hasMilk: boolean;
  };

  // interface는 외부에 공개되어야 하는 것들을 명시, 정의할 때 사용
  interface CoffeeMaker {
    makeCoffee(shots: number): CoffeeCup;
  }

  interface CommercialCoffeeMaker {
    makeCoffee(shots: number): CoffeeCup;
    fillCoffeeBeans(beans: number): void;
    clean(): void;
  }

  // CoffeeMachine은 CoffeeMaker interface를 구현하는 클래스
  class CoffeeMachine implements CoffeeMaker, CommercialCoffeeMaker {
    private static BEANS_GRAMM_PER_SHOT: number = 7; // class level
    private coffeeBeans: number = 0; // instance (object) level

    // instance를 만들 때 초기에 항상 호출되는 함수
    private constructor(coffeeBeans: number) {
      this.coffeeBeans = coffeeBeans; // this.coffeeBeans !== coffeeBeans
    }

    // constructor를 사용하지 않고, static method를 사용하여 instance를 생성하는 방법
    static makeMachine(coffeeBeans: number): CoffeeMachine {
      return new CoffeeMachine(coffeeBeans);
    }

    fillCoffeeBeans(beans: number) {
      if (beans < 0) {
        throw new Error('value for beans should be greater than 0');
      }

      this.coffeeBeans += beans;
    }

    clean(): void {
      console.log('cleaning the machine... 🧼');
    }

    private grindBeans(shots: number) {
      console.log(`grinding beans for ${shots}`);
      if (this.coffeeBeans < shots * CoffeeMachine.BEANS_GRAMM_PER_SHOT) {
        throw new Error('Not enough coffee beans!');
      }
      this.coffeeBeans -= shots * CoffeeMachine.BEANS_GRAMM_PER_SHOT;
    }

    private preheat(): void {
      console.log(`heating up... 🔥`);
    }

    private extract(shots: number): CoffeeCup {
      console.log(`Pulling ${shots} shots... ☕️`);
      return {
        shots,
        hasMilk: false
      };
    }

    makeCoffee(shots: number): CoffeeCup {
      this.grindBeans(shots);
      this.preheat();
      return this.extract(shots);
    }
  }

  // const maker: CoffeeMachine = CoffeeMachine.makeMachine(32);
  // maker.fillCoffeeBeans(32);
  // maker.makeCoffee(2);

  // const maker2: CommercialCoffeeMaker = CoffeeMachine.makeMachine(32);
  // maker2.fillCoffeeBeans(32); // ok
  // maker2.makeCoffee(2); // ok
  // maker2.clean(); // ok

  class AmateurUser {
    constructor(private machine: CoffeeMaker) {}
    makeCoffee() {
      const coffee = this.machine.makeCoffee(2); // 추가로 할 수 있는 함수가 없다
      console.log(coffee);
    }
  }

  class ProBarista {
    constructor(private machine: CommercialCoffeeMaker) {}
    makeCoffee() {
      const coffee = this.machine.makeCoffee(2);
      console.log(coffee);
      this.machine.fillCoffeeBeans(45);
      this.machine.clean();
    }
  }

  const maker: CoffeeMachine = CoffeeMachine.makeMachine(32);
  const amateur = new AmateurUser(maker);
  amateur.makeCoffee();
  // grinding beans for 2
  // heating up... 🔥
  // Pulling 2 shots... ☕️
  // { shots: 2, hasMilk: false }

  const pro = new ProBarista(maker);
  pro.makeCoffee();
  // grinding beans for 2
  // heating up... 🔥
  // Pulling 2 shots... ☕️
  // { shots: 2, hasMilk: false }
  // cleaning the machine... 🧼
}

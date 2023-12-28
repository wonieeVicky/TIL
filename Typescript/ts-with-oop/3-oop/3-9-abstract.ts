{
  type CoffeeCup = {
    shots: number;
    hasMilk?: boolean;
    hasSugar?: boolean;
  };

  interface CoffeeMaker {
    makeCoffee(shots: number): CoffeeCup;
  }

  // abstract class는 instance를 만들 수 없다.
  abstract class CoffeeMachine implements CoffeeMaker {
    private static BEANS_GRAMM_PER_SHOT: number = 7;
    private coffeeBeans: number = 0;

    constructor(coffeeBeans: number) {
      this.coffeeBeans = coffeeBeans;
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

    // extract 함수는 추상적인 abstract 함수로 만들어서
    // 정의만하고, 구현은 이 클래스를 상속하는 자식 클래스에서 구현하도록 한다.
    protected abstract extract(shots: number): CoffeeCup;

    makeCoffee(shots: number): CoffeeCup {
      this.grindBeans(shots);
      this.preheat();
      return this.extract(shots);
    }
  }

  class CaffeLatteMachine extends CoffeeMachine {
    constructor(coffeeBeans: number, public readonly serialNumber: string) {
      super(coffeeBeans);
    }
    private steamMilk(): void {
      console.log('Steaming some milk... 🥛');
    }
    // 추상 클래스(abstract class)를 상속 받은 자식 클래스에서 직접 구현해준다.
    // 구현하지 않으면 에러가 발생함
    protected extract(shots: number): CoffeeCup {
      this.steamMilk();
      return {
        shots,
        hasMilk: true
      };
    }
  }

  class SweetCoffeeMaker extends CoffeeMachine {
    addSugar(): void {
      console.log('Adding sugar... 🍭');
    }
    protected extract(shots: number): CoffeeCup {
      return {
        shots,
        hasSugar: true
      };
    }
  }

  const machines: CoffeeMachine[] = [
    // new CoffeeMachine(16), // abstract class는 instance를 만들 수 없다.
    new CaffeLatteMachine(16, '1'),
    new SweetCoffeeMaker(16)
  ];

  machines.forEach((machine) => {
    console.log('------------------');
    machine.makeCoffee(1);
    machine.clean(); // ok
    machine.fillCoffeeBeans(45); // ok
  });

  // 우리가 상속 클래스를 이용할 때 무언가 반복되는 클래스 중에서
  // 특정한 기능만 다른 클래스가 있다면, 그 기능을 따로 빼는 abstract class를 활용 해 볼 수 있다.
}

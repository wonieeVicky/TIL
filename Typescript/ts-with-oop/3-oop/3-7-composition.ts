{
  type CoffeeCup = {
    shots: number;
    hasMilk?: boolean;
    hasSugar?: boolean;
  };

  interface CoffeeMaker {
    makeCoffee(shots: number): CoffeeCup;
  }

  class CoffeeMachine implements CoffeeMaker {
    private static BEANS_GRAMM_PER_SHOT: number = 7;
    private coffeeBeans: number = 0;

    // instance를 만들 때 초기에 항상 호출되는 함수
    constructor(coffeeBeans: number) {
      this.coffeeBeans = coffeeBeans;
    }

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

  class CaffeLatteMachine extends CoffeeMachine {
    constructor(coffeeBeans: number, public readonly serialNumber: string) {
      super(coffeeBeans);
    }
    private steamMilk(): void {
      console.log('Steaming some milk... 🥛');
    }
    makeCoffee(shots: number): CoffeeCup {
      const coffee = super.makeCoffee(shots); // 부모 클래스의 makeCoffee 함수를 호출
      this.steamMilk();
      return {
        ...coffee,
        hasMilk: true
      };
    }
  }

  class SweetCoffeeMaker extends CoffeeMachine {
    addSugar(): void {
      console.log('Adding sugar... 🍭');
    }
    makeCoffee(shots: number): CoffeeCup {
      const coffee = super.makeCoffee(shots);
      return {
        shots,
        hasSugar: true,
        hasMilk: false
      };
    }
  }

  const machines: CoffeeMachine[] = [
    new CoffeeMachine(16),
    new CaffeLatteMachine(16, '1'),
    new SweetCoffeeMaker(16)
  ];
  // 다형성의 장점은 내부적으로 구현된 다양한 클래스들이 한가지의 인터페이스를 구현하거나
  // 또는 동일한 부모 클래스를 상속했을 때, 동일한 함수를 어떤 클래스인지 구분하지 않고 호출할 수 있다는 장점이 있음
  // 인터페이스와 부모 클래스에 있는 동일한 함수 API를 통해 각각 구현된 자식 클래스의 내부 구현사항을 신경쓰지 않고
  // 약속된 API를 호출함으로써 간편하게 다양한 기능을 활용하도록 만들어줄 수 있다.
  machines.forEach((machine) => {
    console.log('------------------');
    machine.makeCoffee(1);
    machine.clean(); // ok
    machine.fillCoffeeBeans(45); // ok
  });

  class SweetCaffeLatteMachine extends SweetCoffeeMaker, CaffeLatteMachine {
    
  }
}

{
  type CoffeeCup = {
    shots: number;
    hasMilk: boolean;
  };

  // interface는 외부에 공개되어야 하는 것들을 명시, 정의할 때 사용
  interface CoffeeMaker {
    makeCoffee(shots: number): CoffeeCup;
  }

  // CoffeeMachine은 CoffeeMaker interface를 구현하는 클래스
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

  // CaffeLatteMachine은 CoffeeMachine을 상속받는 클래스
  // CoffeeMachine이 상속하려면 constructor가 protected 혹은 public으로 선언되어야 함
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

  const machine = new CoffeeMachine(23);
  const latteMachine = new CaffeLatteMachine(23, '103-S-01');
  const coffee = latteMachine.makeCoffee(1);
  console.log(coffee);
}

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
    private static BEANS_GRAMM_PER_SHOT: number = 7; // class level
    private coffeeBeans: number = 0; // instance (object) level

    // instance를 만들 때 초기에 항상 호출되는 함수
    private constructor(coffeeBeans: number) {
      this.coffeeBeans = coffeeBeans; // this.coffeeBeans !== coffeeBeans
    }

    // constructor를 사용하지 않고, static method를 사용하여 instance를 생성하는 방법
    static makeMachine(coffeeBeans: number): CoffeeMachine {
      return new CoffeeMaker(coffeeBeans);
    }

    fillCoffeeBeans(beans: number) {
      if (beans < 0) {
        throw new Error('value for beans should be greater than 0');
      }

      this.coffeeBeans += beans;
    }

    private grindBeans(shots: number) {
      console.log(`grinding beans for ${shots}`);
      if (this.coffeeBeans < shots * CoffeeMaker.BEANS_GRAMM_PER_SHOT) {
        throw new Error('Not enough coffee beans!');
      }
      this.coffeeBeans -= shots * CoffeeMaker.BEANS_GRAMM_PER_SHOT;
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

  const maker: CoffeeMachine = CoffeeMachine.makeMachine(32);
  maker.fillCoffeeBeans(32);
  maker.makeCoffee(2);

  const maker2: CoffeeMaker = CoffeeMachine.makeMachine(32);
  // maker2.fillCoffeeBeans(32); // error
  maker2.makeCoffee(2);
}

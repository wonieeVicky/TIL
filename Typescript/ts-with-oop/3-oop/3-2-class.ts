{
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

    // constructor를 사용하지 않고, static method를 사용하여 instance를 생성하는 방법
    static makeMachine(coffeeBeans: number): CoffeeMaker {
      return new CoffeeMaker(coffeeBeans);
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

  const makerInstance2 = new CoffeeMaker(14);
  console.log(makerInstance2); // CoffeeMaker { coffeeBeans: 14 }

  const makerInstance3 = CoffeeMaker.makeMachine(3);
  console.log(makerInstance3); // CoffeeMaker { coffeeBeans: 3 }
}

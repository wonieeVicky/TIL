﻿{
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

  coffeeBeans += 3 * BEANS_GRAMM_PER_SHOT;
  const coffee = makeCoffee(2);
  console.log(coffee);
}

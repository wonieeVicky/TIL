interface Employee {
  pay(): void;
}

class FullTimeEmployee implements Employee {
  pay() {
    console.log(`full time!!`);
  }
  workFullTime() {}
}

class PartTimeEmployee implements Employee {
  pay() {
    console.log(`part time!!`);
  }
  workPartTime() {}
}

// 세부적인 타입을 인자로 받아서 추상적인 타입으로 다시 리턴하는 함수는 💩
function payBad(employee: Employee): Employee {
  employee.pay();
  return employee;
}

function pay<T extends Employee>(employee: T): T {
  employee.pay();
  return employee;
}

const vicky = new FullTimeEmployee();
const wonny = new PartTimeEmployee();

vicky.workFullTime(); // workFullTime을 사용할 수 있음
wonny.workPartTime();

const vickyAfterPay = payBad(vicky) as FullTimeEmployee;
const wonnyAfterPay = payBad(wonny);

vickyAfterPay.workFullTime(); // Error :: 'Employee' 형식에 'workFullTime' 속성이 없습니다. 세부 클래스 정보를 잃어버림

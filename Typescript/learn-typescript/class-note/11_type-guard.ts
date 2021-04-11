interface Developer {
  name: string;
  skill: string;
}

interface Person {
  name: string;
  age: number;
}

function introduce(): Developer | Person {
  return { name: 'Vicky', age: 32, skill: 'React' };
}

var vicky = introduce();
console.log(vicky.name); // Vicky
console.log(vicky.skill); // Type error! Union 타입을 썻을 때에는 공통된 속성만 접근이 가능하므로 SKILL 접근 불가

// 이를 타입 단언으로 해결할 수 있다.
if ((vicky as Developer).skill) {
  var skill = (vicky as Developer).skill;
  console.log(skill); // React
} else if ((vicky as Person).age) {
  var age = (vicky as Person).age;
  console.log(age); // 32
}

// 타입 가드 정의
function isDeveloper(target: Developer | Person): target is Developer {
  return (target as Developer).skill !== undefined;
}

if (isDeveloper(vicky)) {
  console.log(vicky.skill);
} else {
  console.log(vicky.age);
}

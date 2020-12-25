// 9. 함수
// 1) this
// 우리가 원하는 콘텍스트를 일혹 다른 값이 되곤하는 this
/* const obj = {
  a: 'Hello',
  b: function () {
    console.log(this.a); // obj.a
    // Inner function
    function b() {
      console.log(this.a); // global.a
    }
  },
};*/

// 객체 데이터 obj에서 b 메서드는 a를 this를 통해 참조한다.
const obj = {
  a: 'Hello!',
  b: function () {
    console.log(this.a); // Hello!
  },
};

// this가 유효한 콘텍스트를 상실하여 a를 참조할 수 없게되는 경우 (콜백함수들이 여기에 해당함)
/*obj.b(); // Hello!
const b = obj.b;
b(); // Cannot read property 'a' of undefined

function someFn(cb: any) {
  cb();
}
someFn(obj.b); // Cannot read property 'a' of undefined
setTimeout(obj.b, 100); // undefined

// 위 같은 경우를 대비 this 콘텍스트를 정상적으로 유지할 수 있는 방법?
// 1. bind 메소드를 사용해 this를 직접 연결해준다.
const c = obj.b.bind(obj);
c(); // Hello!

function someFn(cb: any) {
  cb();
}
someFn(obj.b.bind(obj)); // Hello!
setTimeout(obj.b.bind(obj), 100); // Hello!


// 2. 화살표 함수를 사용해 유효한 콘텍스트를 유지하며 메소드를 호출한다.
obj.b(); // Hello

const b = () => obj.b();
b(); // Hello

function someFn(cb: any) {
  cb();
}
someFn(() => obj.b()); // Hello
setTimeout(() => obj.b(), 100); // Hello

// 클래스의 메소드 멤버 정의 시에도 화살표 함수를 사용 가능
class Cat {
  constructor(private name: string) {}
  getName = () => {
    console.log(this.name);
  };
}
const cat = new Cat('Nana');
cat.getName(); // Nana

const getName = cat.getName;
getName(); // Nana

function someFn(cb: any) {
  cb();
}
someFn(cat.getName); // Nana


// 명시적 this
// strict mode에서는 call 메서드를 사용하여 this를 캡쳐하여도 this는 암시적인 any타입이므로 에러를 발생시킴
interface ICat {
  name: string;
}
const cat: ICat = {
  name: 'Nana',
};

function someFn(greeting: string) {
  // Error - TS2683: 'this' implicitly has type 'any' because it does not have a type annotation.
  console.log(`${greeting} ${this.name}`);
}
someFn.call(cat, 'Hello'); // Hello Nana

// this 타입을 명시적으로 선언: 첫번째 fake 매개변수로 this를 선언
interface ICat {
  name: string;
}
const cat: ICat = {
  name: 'Nana',
};
function someFn(this: ICat, greeting: string) {
  console.log(`${greeting} ${this.name}`);
}
someFn.call(cat, 'Hello'); // Hello Nana
*/

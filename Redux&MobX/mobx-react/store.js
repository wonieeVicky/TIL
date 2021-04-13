const { observable, configure, action } = require("mobx");

configure({ enforceActions: "always" }); // Mobx를 엄격모드로 활성화 해준다.

// 일반 객체 리터럴은 decorator로 observable을 붙일 수 없다. hoc로 감싸줘야 함
const userStore = observable({
  isLoggingIn: false,
  data: null,
  logIn(data) {
    this.isLoggingIn = true;
    setTimeout(
      action(() => {
        this.data = data;
        this.isLoggingIn = false;
        postStore.data.push(1); // redux에 비해 편한 점 : userStore에서 postStore의 데이터를 바꿀 수 있음
      }),
      2000
    );
  },
  logOut() {
    this.data = null;
  },
});

const postStore = observable({
  data: [],
  addPost(data) {
    this.data.push(data);
  },
  // getter를 활용한 computed 역할을 하는 함수 생성 : 의존된 데이터가 바뀌기 전까지는 캐싱을 해서 같은 값을 사용한다.
  // getter를 활용하여 성능 최적화를 할 수 있다. 복잡한 연산일 경우 더더욱 도입한다.
  get postLength() {
    return this.data.length;
  },
  // setter 활용
  set post(value) {
    this.data = value;
  },
});

export { userStore, postStore };

const { observable } = require("mobx");

// 일반 객체 리터럴은 decorator로 observable을 붙일 수 없다. hoc로 감싸줘야 함
const userStore = observable({
  isLoggingIn: false,
  data: null,
  logIn(data) {
    this.isLoggingIn = true;
    setTimeout(() => {
      this.data = data;
      this.isLoggingIn = false;
      postStore.data.push(1); // redux에 비해 편한 점 : userStore에서 postStore의 데이터를 바꿀 수 있음
    }, 2000);
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
});

export { userStore, postStore };

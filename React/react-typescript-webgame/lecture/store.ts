import { observable, action } from "mobx";

export interface User {
  nickname: string;
  password: string;
}

interface IUserStore {
  isLoggingIn: boolean;
  data: User | null;
  logIn: (data: User) => void;
  logOut: () => void;
}

const userStore = observable<IUserStore>({
  isLoggingIn: false,
  data: null,
  logIn: action((data: User) => {
    userStore.isLoggingIn = true;
    setTimeout(
      action(() => {
        userStore.data = data;
        userStore.isLoggingIn = false;
        postStore.addPost("hello");
      }),
      2000
    );
  }),
  logOut: action(() => {
    userStore.data = null;
  }),
});

interface IPostStore {
  data: string[];
  addPost: (data: string) => void;
}

const postStore = observable<IPostStore>({
  data: [],
  addPost: action((data: string) => postStore.data.push(data)),
});

export { userStore, postStore };

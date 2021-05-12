import * as React from "react";
import { createContext, ReactElement, FC } from "react";
import { userStore, postStore } from "./store";

// 몹엑스는 데이터 구조가 리덕스에 비해 자유로운 편이다.
export const storeContext = createContext({
  userStore,
  postStore,
});

interface Props {
  children: ReactElement;
}

export const StoreProvider: FC<Props> = ({ children }) => (
  <storeContext.Provider value={{ userStore, postStore }}>{children}</storeContext.Provider>
);

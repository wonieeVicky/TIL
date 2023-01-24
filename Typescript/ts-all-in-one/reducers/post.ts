import { Reducer } from "redux";
import { AddPostAction, AddPostData } from "../actions/post";

const initialState: AddPostData[] = [];

const postReducer: Reducer<AddPostData[], AddPostAction> = (prevState = initialState, action) => {
  // 새로운 state 만들어주기
  switch (action.type) {
    case "ADD_POST":
      return [...prevState, action.data];
    default:
      return prevState;
  }
};

export default postReducer;

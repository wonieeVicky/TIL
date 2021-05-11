import produce from "immer";
import { ADD_POST, AddPostAction } from "../actions/post";

const initialState: string[] = []; // 객체 내부의 빈 배열은 never[]로 타입추론, 그냥 빈 배열은 any[]로 타입추론

const postReducer = (prevState = initialState, action: AddPostAction): string[] => {
  return produce(prevState, (draft) => {
    switch (action.type) {
      case ADD_POST:
        draft.push(action.data);
        break;
      default:
        break;
    }
  });
};

export default postReducer;

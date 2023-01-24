export type AddPostData = { title: string; content: string };
export type AddPostAction = {
  type: "ADD_POST";
  data: AddPostData;
};
export const addPost = (data: AddPostData): AddPostAction => {
  return {
    type: "ADD_POST",
    data,
  };
};

export default {
  addPost,
};

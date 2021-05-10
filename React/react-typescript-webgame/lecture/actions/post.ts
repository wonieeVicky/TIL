export const ADD_POST = "ADD_POST";

export const addPost = (data) => {
  return {
    type: ADD_POST,
    data,
  };
};

const { createAsyncThunk } = require("@reduxjs/toolkit");

const delay = (time, value) =>
  new Promise((resolve, reject) =>
    setTimeout(() => {
      resolve(value);
    }, time)
  );

const addPost = createAsyncThunk("post/add", async (data, thunkAPI) => {
  console.log("data:", data);
  return await delay(500, {
    title: "새 게시글",
    content: "내용이 들어간다",
  });
});

module.exports = { addPost };

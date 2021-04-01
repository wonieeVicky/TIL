const { createSlice } = require("@reduxjs/toolkit");
const { logIn } = require("../actions/user");

const initialState = {
  isLoggingIn: false,
  data: null,
  email: "",
  password: "",
  prices: Array(100)
    .fill()
    .map((v, i) => (i + 1) * 100),
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // 동기적 액션, 내부적 액션
    // 알아서 액션을 만들어준다.
    logOut(state, action) {
      state.data = null;
    },
    setEmail(state, action) {
      state.email = action.payload;
    },
    setPassword(state, action) {
      state.password = action.payload;
    },
  },
  extraReducers: {
    // 비동기 액션, 외부적 액션 (pending, fulfilled, rejected로 사용)
    // user/logIn/pending
    [logIn.pending](state, action) {
      state.isLoggingIn = true;
    },
    // user/logIn/fulfilled
    [logIn.fulfilled](state, action) {
      state.data = action.payload;
      state.isLoggingIn = false;
    },
    // user/login/rejected
    [logIn.rejected](state, action) {
      state.data = null;
      state.isLoggingIn = false;
    },
  },
});

module.exports = userSlice;

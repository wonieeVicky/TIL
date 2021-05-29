const mongoose = require("mongoose");

const { Schema } = mongoose;
// _id는 기본적으로 생성하므로 생략 가능
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Number, // Int32가 아니다. 기본 자바스크립트 데이터 값을 사용해야 한다.
    required: true,
  },
  married: {
    type: Boolean,
    required: true,
  },
  comment: String, // option이 type만 있을 때에는 간단하게 작성가능 required: false
  createdAt: {
    type: Date,
    default: Date.now, // Sequelize.NOW
  },
});

module.exports = mongoose.model("User", userSchema);

const mongoose = require("mongoose");

const { Schema } = mongoose;
const roomSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  max: {
    type: Number,
    required: true,
    default: 10, // 최대 10명
    min: 2 // 최소 2명
  },
  owner: {
    // 방장
    type: String,
    required: true
  },
  password: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Room", roomSchema);

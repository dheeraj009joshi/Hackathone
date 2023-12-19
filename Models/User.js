const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");


const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['worker', 'manager', 'user','technician'],
    default: 'user',
    },
  deviceID: { type: String, required: true },
  skills: [String],
  latitude: String,
  longitude: String,
  industryId: String,
  phoneNumber: String,
  regId:String,
  gender:{
    type:String,
    enum: ['male', 'female', 'other'],
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;

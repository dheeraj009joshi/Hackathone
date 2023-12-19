const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");


const userSchema = new Schema({
  Name: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    validate: {
      validator: validator.isEmail,
      message: "Invalid email address",
    },
  },
  Password: {
    type: String,
    required: true,
    minlength: 6,
    trim: true,
  },
  Role: {
    type: String,
    enum: ['worker', 'manager', 'user','technician'],
    default: 'user',
    },
  DeviceID: { type: String, required: true },
  Skills: [String],
  Latitude: String,
  Longitude: String,
  IndustryId: String,
  RegistrationId:String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;

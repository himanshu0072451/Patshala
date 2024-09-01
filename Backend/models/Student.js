const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  studentDetails: {
    studentId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  otp: { type: String },
  otpExpiration: { type: Date },
  registrationDate: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: false },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
});

module.exports = mongoose.model("Student", StudentSchema);

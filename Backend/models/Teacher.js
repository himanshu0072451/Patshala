const mongoose = require("mongoose");

const TeacherSchema = new mongoose.Schema({
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
  teacherDetails: {
    teacherId: {
      type: String,
      required: true,
      unique: true,
    },
    subjects: {
      type: [String],
      required: true,
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

module.exports = mongoose.model("Teacher", TeacherSchema);

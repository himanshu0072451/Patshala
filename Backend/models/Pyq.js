// models/PYQ.js
const mongoose = require("mongoose");

const PYQSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  viewURL: {
    type: String,
    required: true,
  },
  downloadURL: {
    type: String,
    required: true,
  },
  uploadedBy: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  time: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("PYQ", PYQSchema);

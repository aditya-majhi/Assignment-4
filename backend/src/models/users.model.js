const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    // In production, store a hashed password
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["recruiter", "candidate"],
    required: true,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = { User };

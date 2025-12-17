const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  name: String,
  email: { type: String, required: true, unique: true },
  photoURL: String,
  role: { type: String, default: "Student", enum: ["Student", "Moderator", "Admin"] },
});

module.exports = mongoose.model("User", userSchema);

const mongoose = require("mongoose");

const adminFormSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
});

module.exports = mongoose.model("AdminForm", adminFormSchema);

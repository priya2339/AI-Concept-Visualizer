const mongoose = require("mongoose");

const conceptSchema = new mongoose.Schema({
  topic: String,
  explanation: String,
  codeSnippet: String
});

module.exports = mongoose.model("Concept", conceptSchema);

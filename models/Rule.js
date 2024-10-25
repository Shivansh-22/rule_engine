const mongoose = require("mongoose");

const RuleSchema = new mongoose.Schema({
  ruleName: { type: String, required: true },
  ruleString: { type: String, required: true },
});

module.exports = mongoose.model("Rule", RuleSchema);

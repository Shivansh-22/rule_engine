const mongoose = require("mongoose");
const RuleCollectionSchema = new mongoose.Schema({
  collectionName: { type: String, required: true },
  rules: [{ type: mongoose.Schema.Types.ObjectId, ref: "Rule" }],
});

module.exports = mongoose.model("RuleCollection", RuleCollectionSchema);

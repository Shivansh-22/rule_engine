const Rule = require("../models/Rule");
const RuleCollection = require("../models/RuleCollection");

exports.addRule = async (req, res) => {
  try {
    const { ruleName, ruleString } = req.body;

    const existingRule = await Rule.findOne({ ruleName });
    if (existingRule) {
      return res.status(400).json({ msg: "Rule name already exists" });
    }

    const newRule = new Rule({ ruleName, ruleString });
    await newRule.save();

    res.json(newRule);
  } catch (err) {
    console.error("Error in addRule:", err);
    res.status(500).json({ msg: "Internal Server Error", error: err.message });
  }
};

exports.updateRule = async (req, res) => {
  try {
    const { ruleName, newRuleString } = req.body;
    const updatedRule = await Rule.findOneAndUpdate(
      { ruleName },
      { ruleString: newRuleString },
      { new: true }
    );

    if (!updatedRule) {
      return res.status(404).json({ msg: "Rule not found" });
    }

    res.json(updatedRule);
  } catch (err) {
    console.error("Error in updateRule:", err);
    res.status(500).json({ msg: "Internal Server Error", error: err.message });
  }
};

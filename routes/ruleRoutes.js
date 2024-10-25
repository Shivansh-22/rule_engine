const express = require("express");
const router = express.Router();
const ruleController = require("../controllers/ruleController");
const ruleCollectionController = require("../controllers/ruleCollectionController");

router.post(
  "/create-collection",
  ruleCollectionController.createRuleCollection
);
router.post(
  "/evaluate-collection",
  ruleCollectionController.evaluateCollection
);
router.post("/add-rule", ruleController.addRule);
router.post("/update-rule", ruleController.updateRule);

module.exports = router;

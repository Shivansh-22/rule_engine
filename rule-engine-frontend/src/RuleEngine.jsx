import React, { useState } from "react";

const RuleEngine = () => {
  const [activeTab, setActiveTab] = useState("addRule");
  const [ruleName, setRuleName] = useState("");
  const [ruleString, setRuleString] = useState("");
  const [collectionName, setCollectionName] = useState("");
  const [ruleNames, setRuleNames] = useState("");
  const [evaluationObject, setEvaluationObject] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleAddRule = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/rules/add-rule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ruleName, ruleString }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess("Rule added successfully!");
        setError("");
        setRuleName("");
        setRuleString("");
      } else {
        setError(data.msg || "Failed to add rule");
        setSuccess("");
      }
    } catch (err) {
      setError("Failed to connect to server");
      setSuccess("");
    }
  };

  const handleUpdateRule = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:5000/api/rules/update-rule",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ruleName, newRuleString: ruleString }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setSuccess("Rule updated successfully!");
        setError("");
        setRuleName("");
        setRuleString("");
      } else {
        setError(data.msg || "Failed to update rule");
        setSuccess("");
      }
    } catch (err) {
      setError("Failed to connect to server");
      setSuccess("");
    }
  };

  const handleCreateCollection = async (e) => {
    e.preventDefault();
    try {
      const ruleNameList = ruleNames.split(",").map((name) => name.trim());
      const response = await fetch(
        "http://localhost:5000/api/rules/create-collection",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ collectionName, ruleNames: ruleNameList }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setSuccess("Collection created successfully!");
        setError("");
        setCollectionName("");
        setRuleNames("");
      } else {
        setError(data.msg || "Failed to create collection");
        setSuccess("");
      }
    } catch (err) {
      setError("Failed to connect to server");
      setSuccess("");
    }
  };

  const handleEvaluateCollection = async (e) => {
    e.preventDefault();
    try {
      let evalObj = {};
      try {
        evalObj = JSON.parse(evaluationObject);
      } catch (err) {
        setError("Invalid JSON format for evaluation object");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/rules/evaluate-collection",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            collectionName,
            evaluationObject: evalObj,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setResult(data.result);
        setError("");
      } else {
        setError(data.msg || "Failed to evaluate collection");
        setResult(null);
      }
    } catch (err) {
      setError("Failed to connect to server");
      setResult(null);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">Rule Engine</h1>
        <p className="description">
          Manage and evaluate rules for your application
        </p>

        <div className="tabs">
          <button
            className={`tab ${activeTab === "addRule" ? "active" : ""}`}
            onClick={() => setActiveTab("addRule")}
          >
            Add Rule
          </button>
          <button
            className={`tab ${activeTab === "updateRule" ? "active" : ""}`}
            onClick={() => setActiveTab("updateRule")}
          >
            Update Rule
          </button>
          <button
            className={`tab ${
              activeTab === "createCollection" ? "active" : ""
            }`}
            onClick={() => setActiveTab("createCollection")}
          >
            Create Collection
          </button>
          <button
            className={`tab ${activeTab === "evaluate" ? "active" : ""}`}
            onClick={() => setActiveTab("evaluate")}
          >
            Evaluate
          </button>
        </div>

        {error && <div className="alert error">{error}</div>}
        {success && <div className="alert success">{success}</div>}

        <div className="content">
          {activeTab === "addRule" && (
            <form onSubmit={handleAddRule} className="form">
              <div className="form-group">
                <label>Rule Name:</label>
                <input
                  type="text"
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Rule String:</label>
                <textarea
                  value={ruleString}
                  onChange={(e) => setRuleString(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="button primary">
                Add Rule
              </button>
            </form>
          )}

          {activeTab === "updateRule" && (
            <form onSubmit={handleUpdateRule} className="form">
              <div className="form-group">
                <label>Rule Name:</label>
                <input
                  type="text"
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>New Rule String:</label>
                <textarea
                  value={ruleString}
                  onChange={(e) => setRuleString(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="button primary">
                Update Rule
              </button>
            </form>
          )}

          {activeTab === "createCollection" && (
            <form onSubmit={handleCreateCollection} className="form">
              <div className="form-group">
                <label>Collection Name:</label>
                <input
                  type="text"
                  value={collectionName}
                  onChange={(e) => setCollectionName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Rule Names (comma-separated):</label>
                <input
                  type="text"
                  value={ruleNames}
                  onChange={(e) => setRuleNames(e.target.value)}
                  placeholder="rule1, rule2, rule3"
                  required
                />
              </div>
              <button type="submit" className="button primary">
                Create Collection
              </button>
            </form>
          )}

          {activeTab === "evaluate" && (
            <form onSubmit={handleEvaluateCollection} className="form">
              <div className="form-group">
                <label>Collection Name:</label>
                <input
                  type="text"
                  value={collectionName}
                  onChange={(e) => setCollectionName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Evaluation Object (JSON):</label>
                <textarea
                  value={evaluationObject}
                  onChange={(e) => setEvaluationObject(e.target.value)}
                  placeholder='{"age": 35, "department": "Sales", "salary": 60000}'
                  required
                />
              </div>
              <button type="submit" className="button primary">
                Evaluate
              </button>
              {result !== null && (
                <div className={`result ${result ? "success" : "error"}`}>
                  Evaluation Result: {result ? "True" : "False"}
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default RuleEngine;

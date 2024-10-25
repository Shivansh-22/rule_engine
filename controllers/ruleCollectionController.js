const Rule = require("../models/Rule");
const RuleCollection = require("../models/RuleCollection");
function tokenize(input) {
  input = input
    .replace(/\(/g, " ( ")
    .replace(/\)/g, " ) ")
    .replace(/\s+/g, " ")
    .trim();

  const tokens = [];
  const regex = /('[^']*'|\(|\)|AND|OR|NOT|>=|<=|!=|=|[<>]|\S+)/g;
  let match;

  while ((match = regex.exec(input)) !== null) {
    let token = match[1] || match[0];

    if (token.startsWith("'") && token.endsWith("'")) {
      tokens.push({ type: "LITERAL", value: token.slice(1, -1) });
    } else if (!isNaN(token)) {
      tokens.push({ type: "LITERAL", value: Number(token) });
    } else if (["AND", "OR", "NOT"].includes(token)) {
      tokens.push({ type: "LOGICAL", value: token });
    } else if ([">=", "<=", "!=", "=", ">", "<"].includes(token)) {
      tokens.push({ type: "OPERATOR", value: token });
    } else if (token === "(" || token === ")") {
      tokens.push({ type: "PARENTHESIS", value: token });
    } else {
      tokens.push({ type: "IDENTIFIER", value: token });
    }
  }

  return tokens;
}

const createNode = {
  comparison: (left, operator, right) => ({
    type: "COMPARISON",
    left,
    operator,
    right,
  }),
  and: (left, right) => ({
    type: "AND",
    left,
    right,
  }),
  or: (left, right) => ({
    type: "OR",
    left,
    right,
  }),
  literal: (value) => ({
    type: "LITERAL",
    value,
  }),
  identifier: (name) => ({
    type: "IDENTIFIER",
    name,
  }),
};

function parse(tokens) {
  let current = 0;
  let parenthesesCount = 0;

  function peek() {
    return tokens[current] || null;
  }

  function consume() {
    const token = tokens[current];
    current++;
    return token;
  }

  function parseExpression() {
    let node = parseTerm();

    while (peek() && peek().type === "LOGICAL" && peek().value === "OR") {
      consume(); // Skip 'OR'
      node = createNode.or(node, parseTerm());
    }

    return node;
  }

  function parseTerm() {
    let node = parseComparison();

    while (peek() && peek().type === "LOGICAL" && peek().value === "AND") {
      consume(); // Skip 'AND'
      node = createNode.and(node, parseComparison());
    }

    return node;
  }

  function parseComparison() {
    const token = peek();

    if (!token) {
      throw new Error("Unexpected end of input");
    }

    if (token.type === "PARENTHESIS" && token.value === "(") {
      parenthesesCount++;
      consume();
      const node = parseExpression();

      const closing = peek();
      if (!closing || closing.type !== "PARENTHESIS" || closing.value !== ")") {
        throw new Error("Missing closing parenthesis");
      }

      consume();
      parenthesesCount--;
      return node;
    }

    if (token.type === "IDENTIFIER") {
      const left = createNode.identifier(consume().value);

      const operator = peek();
      if (!operator || operator.type !== "OPERATOR") {
        throw new Error("Expected operator after identifier");
      }
      consume();

      const rightToken = peek();
      if (!rightToken) {
        throw new Error("Expected value after operator");
      }
      consume();

      const right =
        rightToken.type === "LITERAL"
          ? createNode.literal(rightToken.value)
          : createNode.identifier(rightToken.value);

      return createNode.comparison(left, operator.value, right);
    }

    throw new Error("Unexpected token: " + JSON.stringify(token));
  }

  const ast = parseExpression();

  if (parenthesesCount !== 0) {
    throw new Error("Unmatched parentheses");
  }

  return ast;
}

function evaluate(ast, context) {
  if (!ast) return null;

  switch (ast.type) {
    case "COMPARISON": {
      const leftValue =
        ast.left.type === "IDENTIFIER"
          ? context[ast.left.name]
          : ast.left.value;
      const rightValue =
        ast.right.type === "IDENTIFIER"
          ? context[ast.right.name]
          : ast.right.value;

      switch (ast.operator) {
        case "=":
          return leftValue === rightValue;
        case "!=":
          return leftValue !== rightValue;
        case ">":
          return leftValue > rightValue;
        case "<":
          return leftValue < rightValue;
        case ">=":
          return leftValue >= rightValue;
        case "<=":
          return leftValue <= rightValue;
        default:
          throw new Error("Unknown operator: " + ast.operator);
      }
    }
    case "AND":
      return evaluate(ast.left, context) && evaluate(ast.right, context);
    case "OR":
      return evaluate(ast.left, context) || evaluate(ast.right, context);
    case "LITERAL":
      return ast.value;
    case "IDENTIFIER":
      if (!(ast.name in context)) {
        throw new Error(`Unknown identifier: ${ast.name}`);
      }
      return context[ast.name];
    default:
      throw new Error("Unknown node type: " + ast.type);
  }
}

function evaluateRule(ruleString, context) {
  try {
    const tokens = tokenize(ruleString);
    const ast = parse(tokens);
    return evaluate(ast, context);
  } catch (error) {
    console.error("Error evaluating rule:", error.message);
    return null;
  }
}

exports.createRuleCollection = async (req, res) => {
  try {
    const { collectionName, ruleNames } = req.body;

    const rules = await Rule.find({ ruleName: { $in: ruleNames } });
    if (rules.length !== ruleNames.length) {
      return res.status(400).json({ msg: "Some rules were not found" });
    }

    const newCollection = new RuleCollection({
      collectionName,
      rules: rules.map((rule) => rule._id),
    });
    await newCollection.save();

    res.json(newCollection);
  } catch (err) {
    console.error("Error in createRuleCollection:", err);
    res.status(500).json({ msg: "Internal Server Error", error: err.message });
  }
};
exports.evaluateCollection = async (req, res) => {
  try {
    const { collectionName, evaluationObject } = req.body;

    const collection = await RuleCollection.findOne({
      collectionName,
    }).populate("rules");
    if (!collection) {
      return res.status(404).json({ msg: "Collection not found" });
    }

    for (let rule of collection.rules) {
      const ruleString = rule.ruleString;

      const result = evaluateRule(ruleString, evaluationObject);

      if (!result) {
        return res.json({ result: false });
      }
    }

    res.json({ result: true });
  } catch (err) {
    console.error("Error in evaluateCollection:", err);
    res.status(500).json({ msg: "Internal Server Error", error: err.message });
  }
};

const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const ruleRoutes = require("./routes/ruleRoutes");
const cors = require("cors");

const app = express();
connectDB();

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);
app.use(bodyParser.json());

app.use("/api/rules", ruleRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

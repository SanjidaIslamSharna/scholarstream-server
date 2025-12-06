require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./config/db");

connectDB();

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.send("ScholarStream API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

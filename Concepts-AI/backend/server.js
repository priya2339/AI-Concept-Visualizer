const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const routes = require("./routes/routes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api", routes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));


  app.get("/", (req, res) => {
  res.status(200).send('Hello from the server.');
});

mongoose.connection.once("open", () => {
  console.log("✅ Connected to MongoDB");
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

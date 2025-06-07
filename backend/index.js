// server.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes.js");
const applyRoutes = require("./routes/applyRoutes.js");
const adminRoutes = require("./routes/adminRoutes.js");
const jobRoutes = require("./routes/jobRoutes.js");
const dbConnection = require("./config/dbConnection.js");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

dbConnection();

app.get("/", (req, res) => {
    res.send("Welcome to the Job filtering API");
}); 
app.use("/api/auth", authRoutes);
app.use("/api/apply", applyRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/jobs", jobRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

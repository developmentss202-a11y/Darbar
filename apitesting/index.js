require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const adminFormSchema = require("./adminFormSchema");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
  });

// Test route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Support form API
app.post("/api/support", async (req, res) => {
  try {
    const adminForm = new adminFormSchema(req.body);

    const savedForm = await adminForm.save();

    res.status(201).json({
      success: true,
      message: "Support request submitted successfully",
      data: savedForm,
    });
  } catch (error) {
    console.error("Error saving support request:", error);

    res.status(500).json({
      success: false,
      message: "Failed to submit support request",
    });
  }
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});

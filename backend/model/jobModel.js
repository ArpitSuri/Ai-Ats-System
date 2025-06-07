const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    keywords: [String], // used for ATS + GPT scoring
    location: String,
    jobType: { type: String, enum: ["Remote", "On-site", "Hybrid"], default: "Remote" },
    salaryRange: String,
    isActive: { type: Boolean, default: true }, // to toggle visibility
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Job", JobSchema);

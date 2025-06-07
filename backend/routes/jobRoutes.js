// routes/jobRoutes.js
const express = require("express");
const { createJob, getAllJobs, getJobById, toggleJobStatus } = require("../controller/jobController.js");
const router = express.Router();

// POST /api/jobs - Add new job
router.post("/", createJob);

// GET /api/jobs - Get all jobs
router.get("/", getAllJobs);

// GET /api/jobs/:id - Get specific job by ID
router.get("/:id", getJobById);


// PUT /api/jobs/:id/toggle - Admin: Toggle job visibility
router.put("/:id/toggle", toggleJobStatus);

module.exports = router;
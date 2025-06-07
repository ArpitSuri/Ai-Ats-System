// routes/adminRoutes.js
const express = require("express");
const { getShortlisted, sendInterviewMail, deleteApplicant } = require("../controller/adminController.js");

const router = express.Router();

router.get("/shortlisted", getShortlisted);
router.post("/send-mail", sendInterviewMail);
router.delete("/:id", deleteApplicant);

module.exports = router;

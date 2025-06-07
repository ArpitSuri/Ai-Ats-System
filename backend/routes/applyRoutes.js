// routes/applyRoutes.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const { handleApplication } = require("../controller/applyController.js");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("resume"), handleApplication);

module.exports = router;

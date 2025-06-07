// routes/applyRoutes.js
const express = require("express");
const multer = require("multer");
const { handleApplication } = require("../controller/applyController.js");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("resume"), handleApplication);

module.exports = router;

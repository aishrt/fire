const express = require("express");
const {
  getLatestVersion,
  addVersion,
} = require("../controllers/versionController");
const router = express.Router();

// Get the latest version
router.get("/versions/latest", getLatestVersion);

// Add a new version (admin use)
router.post("/versions", addVersion);

module.exports = router;

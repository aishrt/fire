const express = require("express");
const {
  uploadDeviceInfo,
  getDeviceInfo,
} = require("../controllers/deviceController");
const router = express.Router();

// Upload or update device info
router.post("/devices", uploadDeviceInfo);

// Get device info by deviceId
router.get("/devices/:deviceId", getDeviceInfo);

module.exports = router;

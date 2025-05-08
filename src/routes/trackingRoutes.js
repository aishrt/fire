const express = require("express");
const { body, param } = require("express-validator");
const validateRequest = require("../middleware/validation");
const {
  getVisitedDomains,
  syncVisitedDomains,
  updateTrackingStatus,
  getTrackingStatus,
  deleteTrackingData,
} = require("../controllers/trackingController");

const router = express.Router();

// Get visited domains
router.get(
  "/visited-domains/:deviceId",
  param("deviceId").notEmpty().isString(),
  validateRequest,
  getVisitedDomains
);

// Sync visited domains
router.post(
  "/sync-visited-domains/:deviceId",
  param("deviceId").notEmpty().isString(),
  body("visitedDomains").isArray(),
  validateRequest,
  syncVisitedDomains
);

// Update tracking status
router.put(
  "/tracking-status/:deviceId",
  param("deviceId").notEmpty().isString(),
  body("trackData").isBoolean(),
  validateRequest,
  updateTrackingStatus
);

// Get tracking status
router.get(
  "/tracking-status/:deviceId",
  param("deviceId").notEmpty().isString(),
  validateRequest,
  getTrackingStatus
);

// Delete tracking data
router.delete(
  "/tracking-data/:deviceId",
  param("deviceId").notEmpty().isString(),
  validateRequest,
  deleteTrackingData
);

module.exports = router; 
const express = require("express");
const {
  getDiscounts,
  createDiscount,
  getDiscountById,
  updateDiscount,
  deleteDiscount,
} = require("../controllers/discountController");
const { body } = require("express-validator");

const router = express.Router();

// Validation middleware
const validateDiscount = [
  body("brandName").notEmpty().trim(),
  body("category").notEmpty().trim(),
  body("code").notEmpty().trim(),
  body("description").notEmpty().trim(),
  body("discountPercentage").isInt({ min: 0, max: 100 }),
  body("logo").optional().isURL(),
  body("url").optional().isURL(),
];

// Get all discounts
router.get("/discounts", getDiscounts);

// Get single discount by ID
router.get("/discounts/:id", getDiscountById);

// Create a new discount
// router.post("/discounts", validateDiscount, createDiscount);
router.post("/discounts", createDiscount);

// Update a discount
router.put("/discounts/:id", updateDiscount);

// Delete a discount
router.delete("/discounts/:id", deleteDiscount);

module.exports = router;

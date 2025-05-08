const express = require("express");
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategories,
} = require("../controllers/categoryController");

const router = express.Router();

// Get all categories (full objects)
router.get("/categories", getAllCategories);
// Get only categoryType list (with 'All')
router.get("/categories-list", getCategories);
router.get("/categories/:id", getCategoryById);
router.post("/categories", createCategory);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

module.exports = router;

const categoryService = require("../services/categoryService");

// Get all categories
const getCategories = async (req, res) => {
  try {
    const querySnapshot = await getDocs(collection(db, "categories"));
    const categories = querySnapshot.docs
      .map((doc) => doc.data().categoryType)
      .filter(Boolean);

    // Remove duplicates and 'All' category
    const uniqueCategories = [...new Set(categories)].filter(
      (cat) => cat !== "All"
    );
    res.json(["All", ...uniqueCategories]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    res.json(category);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const newCategory = await categoryService.createCategory(req.body);
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const updatedCategory = await categoryService.updateCategory(
      req.params.id,
      req.body
    );
    res.json(updatedCategory);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const result = await categoryService.deleteCategory(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  getCategories,
  deleteCategory,
};

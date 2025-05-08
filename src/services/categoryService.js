const { collection, getDocs, addDoc, doc, getDoc, updateDoc, deleteDoc } = require("firebase/firestore");
const { db } = require("../config/firebase");

// Get all categories
const getAllCategories = async () => {
  const querySnapshot = await getDocs(collection(db, "categories"));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// Get single category by ID
const getCategoryById = async (id) => {
  const docRef = doc(db, "categories", id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) throw new Error("Category not found");
  return { id: docSnap.id, ...docSnap.data() };
};

// Create a new category
const createCategory = async (categoryData) => {
  if (!categoryData.categoryType) throw new Error("Missing required field: categoryType");
  const docRef = await addDoc(collection(db, "categories"), { categoryType: categoryData.categoryType });
  return { id: docRef.id, categoryType: categoryData.categoryType };
};

// Update a category
const updateCategory = async (id, updateData) => {
  const docRef = doc(db, "categories", id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) throw new Error("Category not found");
  await updateDoc(docRef, { categoryType: updateData.categoryType });
  return { id, categoryType: updateData.categoryType };
};

// Delete a category
const deleteCategory = async (id) => {
  const docRef = doc(db, "categories", id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) throw new Error("Category not found");
  await deleteDoc(docRef);
  return { message: "Category deleted successfully" };
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
}; 
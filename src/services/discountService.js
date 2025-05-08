const { 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  getDoc, 
  updateDoc, 
  deleteDoc 
} = require("firebase/firestore");
const { db } = require("../config/firebase");

// Get all discounts
const getAllDiscounts = async () => {
  const querySnapshot = await getDocs(collection(db, "discounts"));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// Get single discount by ID
const getDiscountById = async (id) => {
  const docRef = doc(db, "discounts", id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    throw new Error("Discount not found");
  }

  return {
    id: docSnap.id,
    ...docSnap.data()
  };
};

// Get all categories
const getAllCategories = async () => {
  const querySnapshot = await getDocs(collection(db, "categories"));
  const categories = querySnapshot.docs
    .map((doc) => doc.data().categoryType)
    .filter(Boolean);
  
  // Remove duplicates and 'All' category
  const uniqueCategories = [...new Set(categories)].filter(
    (cat) => cat !== "All"
  );
  return ["All", ...uniqueCategories];
};

// Create a new discount
const createDiscount = async (discountData) => {
  const {
    brandName,
    category,
    code,
    description,
    discountPercentage,
    logo,
    url
  } = discountData;

  // Validate required fields
  if (!brandName || !category) {
    throw new Error("Missing required fields");
  }

  const newDiscountData = {
    brandName,
    category,
    code,
    createdAt: new Date().toISOString(),
    description,
    discountPercentage: parseInt(discountPercentage),
    logo: logo || "",
    url: url || ""
  };

  const docRef = await addDoc(collection(db, "discounts"), newDiscountData);
  
  return {
    id: docRef.id,
    ...newDiscountData
  };
};

// Update a discount
const updateDiscount = async (id, updateData) => {
  const docRef = doc(db, "discounts", id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    throw new Error("Discount not found");
  }

  const {
    brandName,
    category,
    code,
    description,
    discountPercentage,
    logo,
    url
  } = updateData;

  const finalUpdateData = {
    ...(brandName && { brandName }),
    ...(category && { category }),
    ...(code && { code }),
    ...(description && { description }),
    ...(discountPercentage && { discountPercentage: parseInt(discountPercentage) }),
    ...(logo && { logo }),
    ...(url && { url }),
    updatedAt: new Date().toISOString()
  };

  await updateDoc(docRef, finalUpdateData);

  return {
    id,
    ...docSnap.data(),
    ...finalUpdateData
  };
};

// Delete a discount
const deleteDiscount = async (id) => {
  const docRef = doc(db, "discounts", id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    throw new Error("Discount not found");
  }

  await deleteDoc(docRef);
  return { message: "Discount deleted successfully" };
};

module.exports = {
  getAllDiscounts,
  getDiscountById,
  getAllCategories,
  createDiscount,
  updateDiscount,
  deleteDiscount
}; 
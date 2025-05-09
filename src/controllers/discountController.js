const {
  collection,
  getDocs,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} = require("firebase/firestore");
const { db } = require("../config/firebase");

// Get all discounts
const getDiscounts = async (req, res) => {
  try {
    const querySnapshot = await getDocs(collection(db, "discounts"));
    const discounts = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(discounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single discount by ID
const getDiscountById = async (req, res) => {
  try {
    const { id } = req.params;
    const docRef = doc(db, "discounts", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return res.status(404).json({ error: "Discount not found" });
    }

    res.json({
      id: docSnap.id,
      ...docSnap.data(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new discount
const createDiscount = async (req, res) => {
  try {
    const {
      brandName,
      category,
      code,
      description,
      discountPercentage,
      logo,
      url,
    } = req.body;

    // Validate required fields
    if (!brandName || !category) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Create the discount document
    const discountData = {
      brandName,
      category,
      code,
      createdAt: new Date().toISOString(),
      description,
      discountPercentage: parseInt(discountPercentage),
      logo: logo || "",
      url: url || "",
    };

    const docRef = await addDoc(collection(db, "discounts"), discountData);

    res.status(201).json({
      id: docRef.id,
      ...discountData,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a discount
const updateDiscount = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      brandName,
      category,
      code,
      description,
      discountPercentage,
      logo,
      url,
    } = req.body;

    const docRef = doc(db, "discounts", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return res.status(404).json({ error: "Discount not found" });
    }

    const updateData = {
      ...(brandName && { brandName }),
      ...(category && { category }),
      ...(code && { code }),
      ...(description && { description }),
      ...(discountPercentage && {
        discountPercentage: parseInt(discountPercentage),
      }),
      ...(logo && { logo }),
      ...(url && { url }),
      updatedAt: new Date().toISOString(),
    };

    await updateDoc(docRef, updateData);

    res.json({
      id,
      ...docSnap.data(),
      ...updateData,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a discount
const deleteDiscount = async (req, res) => {
  try {
    const { id } = req.params;
    const docRef = doc(db, "discounts", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return res.status(404).json({ error: "Discount not found" });
    }

    await deleteDoc(docRef);
    res.json({ message: "Discount deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getDiscounts,
  createDiscount,
  getDiscountById,
  updateDiscount,
  deleteDiscount,
};

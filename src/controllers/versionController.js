const { collection, getDocs, addDoc } = require("firebase/firestore");
const { db, firebaseApp } = require("../config/firebase");

// Get all versions
const getLatestVersion = async (req, res) => {
  try {
    const querySnapshot = await getDocs(collection(db, "versions"));
    const versions = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Helper to robustly parse createdAt
    function parseCreatedAt(val) {
      if (!val) return null;
      if (typeof val === "object" && typeof val.toDate === "function") {
        return val.toDate();
      }
      const iso = new Date(val);
      if (!isNaN(iso.getTime())) return iso;
      const fallback = Date.parse(val);
      if (!isNaN(fallback)) return new Date(fallback);
      return null;
    }

    // Sort by createdAt descending and get the latest
    versions.sort((a, b) => {
      const dateA = parseCreatedAt(a.createdAt) || new Date(0);
      const dateB = parseCreatedAt(b.createdAt) || new Date(0);
      return dateB.getTime() - dateA.getTime();
    });

    const latest = versions[0] || null;

    res.json({ data: latest });
  } catch (error) {
    console.error("Error fetching versions:", error);
    res.status(500).json({ error: error.message });
  }
};
// Add a new version (admin use)
const addVersion = async (req, res) => {
  try {
    const { latestVersion, createdAt } = req.body;
    if (!latestVersion)
      return res.status(400).json({ error: "Missing latestVersion" });
    const docRef = await addDoc(collection(db, "versions"), {
      latestVersion,
      createdAt: createdAt || new Date().toISOString(),
    });
    res.status(201).json({ id: docRef.id, latestVersion });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getLatestVersion, addVersion };

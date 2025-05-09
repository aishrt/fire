const { collection, getDocs, addDoc } = require("firebase/firestore");
const { db } = require("../config/firebase");
const { v4: uuidv4 } = require("uuid");
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

    // Sort by createdAt descending, then by versionId descending as tiebreaker
    versions.sort((a, b) => {
      const dateA = parseCreatedAt(a.createdAt) || new Date(0);
      const dateB = parseCreatedAt(b.createdAt) || new Date(0);
      if (dateB.getTime() !== dateA.getTime()) {
        return dateB.getTime() - dateA.getTime();
      }
      // Tiebreaker: sort by versionId (string compare, descending)
      if (b.versionId && a.versionId) {
        return b.versionId.localeCompare(a.versionId);
      }
      // Fallback: sort by Firestore doc id
      return b.id.localeCompare(a.id);
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
    const createdAt = new Date();
    const { latestVersion, versionDoc } = req.body;
    const versionId = uuidv4();

    const docRef = await addDoc(collection(db, "versions"), {
      latestVersion,
      createdAt,
      versionDoc,
      versionId,
    });

    res.status(201).json({
      id: docRef.id,
      latestVersion,
      versionDoc,
      versionId,
      createdAt: createdAt.toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getLatestVersion, addVersion };

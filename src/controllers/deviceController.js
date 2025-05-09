const { doc, setDoc, getDoc } = require("firebase/firestore");
const { db } = require("../config/firebase");

// Upload or update device info
const uploadDeviceInfo = async (req, res) => {
  try {
    const { deviceId, ...deviceInfo } = req.body;
    if (!deviceId) return res.status(400).json({ error: "Missing deviceId" });
    const lastUsed = new Date().toISOString();
    let deviceData = {
      ...deviceInfo,
      deviceId,
      lastUsed,
      trackData: false,
      visitedDomains: [],
    };
    // Check if device already exists
    const deviceDocRef = doc(db, "deviceList", deviceId);
    const deviceDocSnap = await getDoc(deviceDocRef);
    if (deviceDocSnap.exists()) {
      const existingData = deviceDocSnap.data();
      deviceData = {
        ...deviceData,
        ...existingData,
        lastUsed,
      };
    }
    await setDoc(deviceDocRef, deviceData, { merge: true });
    res.status(200).json({ success: true, deviceId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get device info by deviceId
const getDeviceInfo = async (req, res) => {
  try {
    const { deviceId } = req.params;
    if (!deviceId) return res.status(400).json({ error: "Missing deviceId" });
    const deviceDocRef = doc(db, "deviceList", deviceId);
    const deviceDocSnap = await getDoc(deviceDocRef);
    if (!deviceDocSnap.exists()) {
      return res.status(404).json({ error: "Device not found" });
    }
    res.json({ id: deviceDocSnap.id, ...deviceDocSnap.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { uploadDeviceInfo, getDeviceInfo };

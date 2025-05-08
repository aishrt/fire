const { doc, getDoc, setDoc, collection, getDocs } = require("firebase/firestore");
const { db } = require("../config/firebase");

// Helper function to get visited domains from Firestore
async function getVisitedDomainsFromFirestore(deviceId) {
  const deviceDocRef = doc(db, "deviceList", deviceId);
  try {
    const deviceDocSnap = await getDoc(deviceDocRef);
    if (deviceDocSnap.exists()) {
      const data = deviceDocSnap.data();
      return {
        visitedDomains: data.visitedDomains || [],
        trackData: data.trackData || false,
      };
    }
    return { visitedDomains: [], trackData: false };
  } catch (error) {
    console.error("Error fetching device document:", error);
    throw error;
  }
}

// Get visited domains
const getVisitedDomains = async (req, res) => {
  try {
    const { deviceId } = req.params;
    const data = await getVisitedDomainsFromFirestore(deviceId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Sync visited domains
const syncVisitedDomains = async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { visitedDomains } = req.body;

    const currentData = await getVisitedDomainsFromFirestore(deviceId);
    
    const merged = [
      ...currentData.visitedDomains,
      ...visitedDomains.filter(
        (lv) =>
          !currentData.visitedDomains.some(
            (rv) => rv.domain === lv.domain && rv.timestamp === lv.timestamp
          )
      ),
    ];

    const deviceDocRef = doc(db, "deviceList", deviceId);
    await setDoc(
      deviceDocRef,
      {
        visitedDomains: merged,
        trackData: currentData.trackData,
      },
      { merge: true }
    );

    res.json({ success: true, visitedDomains: merged });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update tracking status
const updateTrackingStatus = async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { trackData } = req.body;

    const deviceDocRef = doc(db, "deviceList", deviceId);
    await setDoc(deviceDocRef, { trackData }, { merge: true });

    res.json({ success: true, trackData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get tracking status
const getTrackingStatus = async (req, res) => {
  try {
    const { deviceId } = req.params;
    const deviceDocRef = doc(db, "deviceList", deviceId);
    const docSnap = await getDoc(deviceDocRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      res.json({ trackData: !!data.trackData });
    } else {
      res.json({ trackData: false });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete tracking data
const deleteTrackingData = async (req, res) => {
  try {
    const { deviceId } = req.params;
    const deviceDocRef = doc(db, "deviceList", deviceId);
    
    const docSnap = await getDoc(deviceDocRef);
    if (docSnap.exists()) {
      const existingData = docSnap.data();
      await setDoc(
        deviceDocRef,
        {
          ...existingData,
          visitedDomains: [],
        },
        { merge: true }
      );
    }
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getVisitedDomains,
  syncVisitedDomains,
  updateTrackingStatus,
  getTrackingStatus,
  deleteTrackingData,
}; 
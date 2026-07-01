import express from 'express';
import { db } from '../firebase.js';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDoc, setDoc, getDocs } from 'firebase/firestore';

const router = express.Router();
const collectionName = 'users';

// Get all users
router.get('/', async (req, res) => {
  try {
    const snapshot = await getDocs(collection(db, collectionName));
    const users = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      users.push({
        ...data,
        id: doc.id,
        // Send dates as ISO strings
        createdDate: data.createdDate?.toDate ? data.createdDate.toDate().toISOString() : data.createdDate,
        lastUpdated: data.lastUpdated?.toDate ? data.lastUpdated.toDate().toISOString() : data.lastUpdated,
        lastLogin: data.lastLogin?.toDate ? data.lastLogin.toDate().toISOString() : data.lastLogin
      });
    });
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: error.message });
  }
});

// Seed admin user
router.post('/seed-admin', async (req, res) => {
  try {
    const adminId = 'ADMIN-001';
    const adminRef = doc(db, collectionName, adminId);
    const snapshot = await getDoc(adminRef);

    if (!snapshot.exists()) {
      const adminData = req.body;
      await setDoc(adminRef, { ...adminData, id: adminId });
      res.status(201).json({ message: 'Admin seeded successfully' });
    } else {
      res.status(200).json({ message: 'Admin already exists' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new user
router.post('/', async (req, res) => {
  try {
    const userData = req.body;
    // We expect the frontend to have hashed the password or handled it, 
    // or we can do it here, but keeping it simple based on the service signature.
    // Ensure dates are converted if passed as strings
    if(userData.createdDate) userData.createdDate = new Date(userData.createdDate);
    if(userData.lastUpdated) userData.lastUpdated = new Date(userData.lastUpdated);
    if(userData.lastLogin) userData.lastLogin = new Date(userData.lastLogin);
    
    const docRef = await addDoc(collection(db, collectionName), userData);
    res.status(201).json({ id: docRef.id, ...userData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userData = req.body;
    
    if(userData.createdDate) userData.createdDate = new Date(userData.createdDate);
    if(userData.lastUpdated) userData.lastUpdated = new Date(userData.lastUpdated);
    if(userData.lastLogin) userData.lastLogin = new Date(userData.lastLogin);
    
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, userData);
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (id === 'ADMIN-001') {
      return res.status(400).json({ error: 'Cannot delete the root Administrator account.' });
    }
    await deleteDoc(doc(db, collectionName, id));
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

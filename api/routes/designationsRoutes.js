import express from 'express';
import { db } from '../firebase.js';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';

const router = express.Router();
const collectionName = 'designations';

// Get all
router.get('/', async (req, res) => {
  try {
    const snapshot = await getDocs(collection(db, collectionName));
    const items = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      items.push({
        ...data,
        id: doc.id.startsWith(data.id?.substring(0,3) || 'XXX') ? doc.id : data.id || doc.id,
        createdDate: data.createdDate?.toDate ? data.createdDate.toDate().toISOString() : data.createdDate,
        lastUpdated: data.lastUpdated?.toDate ? data.lastUpdated.toDate().toISOString() : data.lastUpdated,
      });
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    if(data.createdDate) data.createdDate = new Date(data.createdDate);
    if(data.lastUpdated) data.lastUpdated = new Date(data.lastUpdated);
    const docRef = await addDoc(collection(db, collectionName), data);
    res.status(201).json({ id: docRef.id, ...data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    if(data.createdDate) data.createdDate = new Date(data.createdDate);
    if(data.lastUpdated) data.lastUpdated = new Date(data.lastUpdated);
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, data);
    res.json({ message: 'Updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await deleteDoc(doc(db, collectionName, id));
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

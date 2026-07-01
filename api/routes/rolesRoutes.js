import express from 'express';
import { db } from '../firebase.js';
import { collection, addDoc, setDoc, updateDoc, deleteDoc, doc, getDoc, getDocs, query, where } from 'firebase/firestore';

const router = express.Router();
const collectionName = 'roles';

async function findRoleDocById(id) {
  const directRef = doc(db, collectionName, id);
  const directSnapshot = await getDoc(directRef);
  if (directSnapshot.exists()) {
    return directSnapshot;
  }

  const q = query(collection(db, collectionName), where('id', '==', id));
  const snapshot = await getDocs(q);
  return snapshot.docs[0];
}

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

    let docRef;
    if (data.id) {
      const existingRoleDoc = await findRoleDocById(data.id);
      if (existingRoleDoc) {
        docRef = existingRoleDoc.ref;
        await setDoc(docRef, data);
      } else {
        docRef = doc(db, collectionName, data.id);
        await setDoc(docRef, data);
      }
    } else {
      docRef = await addDoc(collection(db, collectionName), data);
    }

    res.status(201).json({ id: docRef.id, ...data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get by id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const roleDoc = await findRoleDocById(id);

    if (!roleDoc) {
      return res.status(404).json({ error: 'Role not found' });
    }

    const data = roleDoc.data();
    res.json({
      ...data,
      id: roleDoc.id.startsWith(data.id?.substring(0,3) || 'XXX') ? roleDoc.id : data.id || roleDoc.id,
      createdDate: data.createdDate?.toDate ? data.createdDate.toDate().toISOString() : data.createdDate,
      lastUpdated: data.lastUpdated?.toDate ? data.lastUpdated.toDate().toISOString() : data.lastUpdated,
    });
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

    const roleDoc = await findRoleDocById(id);
    if (!roleDoc) {
      return res.status(404).json({ error: 'Role not found' });
    }

    await updateDoc(roleDoc.ref, data);
    res.json({ message: 'Updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const roleDoc = await findRoleDocById(id);
    if (!roleDoc) {
      return res.status(404).json({ error: 'Role not found' });
    }

    await deleteDoc(roleDoc.ref);
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

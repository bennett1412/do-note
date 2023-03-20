import { db } from "./init";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
  Timestamp,
  serverTimestamp,
  orderBy,
  query,
  where,
} from "firebase/firestore";

// * note related db operations

export const addNote = async (data) => {
  try {
    const docRef = await addDoc(collection(db, "notes"), {
      ...data.newNote,
      timestamp: serverTimestamp(),
      creator: data.creatorId,
    });
    return docRef;
  } catch (error) {
    console.error("Error adding document: ", error);
    return error;
  }
};

export const getNotes = async (creatorId) => {
  try {
    const notesRef = collection(db, "notes");
    const q = query(
      notesRef,
      orderBy("timestamp", "desc"),
      where("creator", "==", creatorId)
    );
    const querySnapshot = await getDocs(q);
    const notes = [];
    querySnapshot.forEach((doc) => {
      notes.push({ id: doc.id, ...doc.data() });
    });
    return notes;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const updateNote = async (noteId, newNote) => {
  try {
    const querySnapshot = await updateDoc(doc(db, "notes", noteId), {
      ...newNote,
      timestamp: serverTimestamp(),
    });
    return querySnapshot;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const deleteNote = async (noteId) => {
  try {
    const res = await deleteDoc(doc(db, "notes", noteId));
    return res;
  } catch (error) {
    console.log(error);
    return error;
  }
};

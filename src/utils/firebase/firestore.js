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
} from "firebase/firestore";

// * note related db operations
export const addNote = async (noteData) => {
  try {
    const docRef = await addDoc(collection(db, "notes"), {
      ...noteData,
      timestamp: serverTimestamp(),
    });
    return docRef;
  } catch (error) {
    console.error("Error adding document: ", error);
    return error;
  }
};

export const getNotes = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "notes"));
    const notes = [];
    querySnapshot.forEach((doc) => {
      notes.push({ id: doc.id, ...doc.data() });
    });
    console.log("query result:", notes);
    return notes;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const updateNote = async (noteId, newNote) => {
  console.log("updating", noteId, newNote);
  try {
    const querySnapshot = await updateDoc(doc(db, "notes", noteId), newNote);
    return querySnapshot;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const deleteNote = async (noteId) => {
  console.log("deleting", noteId);
  try {
    const res = await deleteDoc(doc(db, "notes", noteId));
    return res;
  } catch (error) {
    console.log(error);
    return error;
  }
};

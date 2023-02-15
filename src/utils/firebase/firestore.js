import { db } from "./init";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

// * note related db operations
export const addNote = async (noteData) => {
  try {
    const docRef = await addDoc(collection(db, "notes"), noteData);
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
    return notes;
  } catch (error) {
    console.log(error);
  }
};

export const updateNote = async (noteId, newNote) => {
  try {
    const querySnapshot = await updateDoc(doc(db, "notes", noteId), newNote);
  } catch (error) {
    console.log(error);
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

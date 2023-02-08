import { db } from "./init";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";

// * note related db operations
export const addNote = async (noteData) => {
  try {
    const docRef = await addDoc(collection(db, "notes"), noteData);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
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

export const updateNote = async (noteId, newContent) => {
  try {
    const querySnapshot = await updateDoc(doc(db, "notes", noteId), {
      noteContent: newContent,
    });
  } catch (error) {
    console.log(error);
  }
};

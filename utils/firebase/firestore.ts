import { Note, AddNoteParams } from "@/types/Note";
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
  DocumentReference,
} from "firebase/firestore";

// * note related db operations

export const addNote = async (data: AddNoteParams): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, "notes"), {
      ...data.newNote,
      timestamp: serverTimestamp(),
      creator: data.creatorId,
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    throw new Error('Failed to add note.');
  }
};

export const getNotes = async (creatorId: string): Promise<Note[]> => {
  try {
    const notesRef = collection(db, "notes");
    const q = query(
      notesRef,
      orderBy("timestamp", "desc"),
      where("creator", "==", creatorId)
    );
    const querySnapshot = await getDocs(q);
    const notes: Note[] = [];
    querySnapshot.forEach((doc) => {
      notes.push({ id: doc.id, ...doc.data() } as Note);
    });
    return notes;
  } catch (error) {
    console.log(error);
    throw new Error('Failed to fetch notes');
  }
};

export const updateNote = async (noteId: string, newNote: Note) => {
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

export const deleteNote = async (noteId: string) => {
  try {
    const res = await deleteDoc(doc(db, "notes", noteId));
    return res;
  } catch (error) {
    console.log(error);
    return error;
  }
};
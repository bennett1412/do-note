import type { Note, NoteCreate, NoteUpdate } from "@/types/Note";
import { api } from "@/utils/api";

export const addNote = async (data: NoteCreate): Promise<number> => {
  const note = await api.post<Note>("/api/notes", data);
  return note.id;
};

export const getNotes = async (): Promise<Note[]> => {
  return api.get<Note[]>("/api/notes");
};

export const getArticles = async (): Promise<Note[]> => {
  const notes = await api.get<Note[]>("/api/notes");
  return notes.filter((n) => n.isArticle);
};

export const getNote = async (noteId: number): Promise<Note> => {
  return api.get<Note>(`/api/notes/${noteId}`);
};

export const updateNote = async (noteId: number, data: NoteUpdate): Promise<Note> => {
  return api.patch<Note>(`/api/notes/${noteId}`, data);
};

export const deleteNote = async (noteId: number): Promise<void> => {
  await api.delete(`/api/notes/${noteId}`);
};
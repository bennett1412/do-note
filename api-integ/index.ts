import { AddNoteParams, Note, UpdateNoteFn } from "@/types/Note";
import axios, { AxiosError, AxiosResponse } from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api/v1",
});

export const addToken = (token: string) => {
  API.interceptors.request.use((config) => {
    if (token == null || token == undefined) {
      throw Error("Missing auth token");
    }
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
};

export const getNotes = async (): Promise<[Note]> => {
  try {
    const res = await API.get("/notes");
    console.log(res.data);
    return res.data.notes;
  } catch (error) {
    console.log(error);
    throw Error("Failed to get notes");
  }
};

export const addNote = async ({ newNote }: AddNoteParams): Promise<string> => {
  try {
    const res = await API.post("/notes", {
      newNote: newNote,
    });
    return res.data.noteId;
  } catch (error) {
    console.log(error);
    throw Error("Failed to add note");
  }
};

export const updateNote: UpdateNoteFn = async (fsId, newNote): Promise<string> => {
  try {
    const res = await API.put(`notes/${fsId}`, {
      updatedNote: newNote,
    });
    return res.data.noteId;
  } catch (error) {
    throw Error("Failed to update note");
  }
};

export const deleteNote = async (noteId: string) => {
  try {
    const res = await API.delete(`/notes/${noteId}`);
    return res.data.noteId;
  } catch (error) {
    console.log(error);
    throw new Error("Deletion Failed");
  }
};

import { AddNoteParams, Note } from "@/types/Note";
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

export const addNote = async (newNote: AddNoteParams): Promise<string> => {
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

import { UseMutateFunction } from "@tanstack/react-query";
import { Editor } from "@tiptap/react";
import { MouseEventHandler, MutableRefObject } from "react";

// ── API types (camelCase, matching backend) ─────────────────────

export interface Note {
  id: number;
  noteTitle: string;
  noteContent: string;
  color: string;
  isArticle?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NoteCreate {
  noteTitle: string;
  noteContent?: string;
  color?: string;
  isArticle?: boolean;
}

export interface NoteUpdate {
  noteTitle?: string;
  noteContent?: string;
  color?: string;
  isArticle?: boolean;
}

// ── Legacy types kept for component compatibility ───────────────

export type AddNoteParams = {
  newNote: NoteCreate;
  creatorId: string | null;
};

type cbFn = () => void;

export type AddNoteMutationParams = {
  creatorId: string | null;
  successCb?: cbFn;
  errorCb?: cbFn;
};

export type DeleteNoteMutationParams = {
  creatorId: string | null;
  successCb?: cbFn;
  errorCb?: cbFn;
};

export type UpdateNoteFn = (noteId: number, newNote: NoteUpdate) => Promise<Note>;

export type DeleteMutation = UseMutateFunction<void, Error, string>;

export type NotesContextValue = {
  addingNote: boolean;
  addNote: MouseEventHandler;
  deleteNote: DeleteMutation;
  updateNote: UpdateNoteFn;
};

export type NoteContextType = {
  note_title: string;
  content: string;
  editMode: boolean;
  fsId: string;
  color: string;
  noteRef?: MutableRefObject<HTMLDivElement | null>;
  setEditMode: (state: boolean) => void;
  setColor: (color: string) => void;
};

export type EditorContextType = {
  editor: Editor | null;
};

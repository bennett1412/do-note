import { UseMutateFunction } from '@tanstack/react-query';
export interface Note {
  id: string;
  noteTitle: string;
  noteContent: string;
  colorIndex?: number;
  active?: boolean;
}

export interface NoteContent {
  noteTitle: string;
  noteContent: string;
  colorIndex?: number;
  active?: boolean;
}
export type AddNoteParams = {
  newNote: NoteContent,
  creatorId: string | null
}

type cbFn = () => void;

export type AddNoteMutationParams = {
  creatorId: string | null;
  successCb?: cbFn;
  errorCb?: cbFn;
};

export type DeleteNoteMutationParams = {
  creatorId: string | null,
  successCb?: cbFn,
  errorCb?: cbFn
}

export type UpdateNoteFn = (noteId: string,
  newNote: {
    noteTitle?: string;
    noteContent?: string;
    colorIndex?: number;
    active?: boolean;
  }) => Promise<void>;


export type DeleteMutation = UseMutateFunction<void, Error, string>;
import { UseMutateFunction } from '@tanstack/react-query';
import { Editor } from '@tiptap/react';
import { MouseEventHandler, MutableRefObject } from 'react';
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

// might wanna change this to noteslist or notelist
export type NotesContextValue = {
  addingNote: boolean;
  addNote: MouseEventHandler;
  deleteNote: DeleteMutation;
  updateNote: UpdateNoteFn;
};

export type NoteContextType = {
  noteTitle: string;
  content: string;
  editMode: boolean;
  fsId: string;
  colorIndex: number | undefined;
  noteRef?: MutableRefObject<HTMLDivElement | null>;
  setEditMode: (state: boolean) => void;
  setColorIndex: (colorIndex: number) => void
};

export type EditorContextType = {
  editor: Editor | null
}
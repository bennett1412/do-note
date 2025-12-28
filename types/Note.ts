import { UseMutateFunction } from '@tanstack/react-query';
import { Editor } from '@tiptap/react';
import { MouseEventHandler, MutableRefObject } from 'react';

export interface NoteContent {
  note_title: string;
  note_content: string;
  color: string;
  active?: boolean;
  type?: 'note' | 'article';
}

export interface Note extends NoteContent {
  id: string;
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
    note_title?: string;
    note_content?: string;
    color?: string;
    active?: boolean;
    type?: 'note' | 'article';
  }) => Promise<void>;


export type DeleteMutation = UseMutateFunction<null, Error, string>;

// might wanna change this to noteslist or notelist
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
  setColor: (color: string) => void
};

export type EditorContextType = {
  editor: Editor | null
}
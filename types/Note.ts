export interface Note {
  id?: string;
  noteTitle: string;
  noteContent: string;
  colorIndex?: number;
  active?: boolean;
}
export type AddNoteParams = {
  newNote: Note,
  creatorId: string
}

type cbFn = () => void;

export type AddNoteMutationParams = {
  creatorId: string;
  successCb: cbFn;
  errorCb: cbFn;
};

export type DeleteNoteParamType = {
  creatorId: string,
  successCb: cbFn,
  errorCb: cbFn
}
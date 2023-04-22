export interface Note {
  id: string;
  noteTitle: string;
  noteContent: string;
  colorIndex: Number;
  active: Boolean;
}
export type addNoteParams = {
  newNote: Note,
  creatorId: string
}
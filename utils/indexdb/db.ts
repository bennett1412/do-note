import Dexie, { Table } from 'dexie';
import { Note } from '@/types/Note';


export class NotesDb extends Dexie {
  notes!: Table<Note>;

  constructor() {
    super('notesdb');
    this.version(1).stores({
      notes: '++id'
    })
  }
}

export const db = new NotesDb();
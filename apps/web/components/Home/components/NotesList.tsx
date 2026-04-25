import type React from "react";
import { type MouseEventHandler, useState, createContext } from "react"
import Note from "./Note";
import styles from "../styles/noteslist.module.scss";
import { IoAddOutline } from "react-icons/io5";
import { Oval } from "react-loader-spinner";
import type { DeleteMutation, Note as NoteType, NotesContextValue, UpdateNoteFn } from "@/types/Note";
import Button from "@/components/Common/Button";

export const NotesContext = createContext<NotesContextValue | undefined>(undefined);

type NoteListProps = {
  addingNote: boolean;
  notes?: NoteType[];
  addNote: MouseEventHandler;
  deleteNote: DeleteMutation;
  updateNote: UpdateNoteFn;
};

const NotesList: React.FC<NoteListProps> = ({
  addingNote,
  addNote,
  notes,
  updateNote,
  deleteNote,
}) => {
  const [_, setSelectedId] = useState<string | null>(null);
  return (
    <NotesContext.Provider value={{ addingNote, addNote, updateNote, deleteNote }}>
      <section className={styles.notes_list}>
        {notes?.map((note) => {
          return (
            <Note
              key={note.id}
              active={note.active ?? false}
              title={note.note_title}
              content={note.note_content}
              fsId={note.id}
              color={note.color}
              setSelectedId={setSelectedId}
              // updateNote={updateNote}
              // deleteNote={deleteNote}
            />
          );
        })}

        <Button disabled={addingNote} onClick={addNote} className={styles.add_button} variant="filled" radius="10px">
          {addingNote ? (
            <Oval
              height={30}
              width={30}
              visible={true}
              ariaLabel="oval-loading"
              secondaryColor="gray"
              strokeWidth={2}
              strokeWidthSecondary={2}
            />
          ) : (
            <IoAddOutline size={25} color="var(--color-primary-100)" />
          )}
        </Button>
      </section>
    </NotesContext.Provider>
  );
};

export default NotesList;

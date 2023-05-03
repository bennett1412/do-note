import React, { MouseEventHandler, useState } from "react";
import Note from "./Note";
import styles from "@/styles/home/noteslist.module.scss";
import { IoAddOutline } from "react-icons/io5";
import { Oval } from "react-loader-spinner";
import {
  DeleteNoteMutationParams,
  Note as NoteType,
  UpdateNoteFn,
} from "@/types/Note";

type NoteListProps = {
  addingNote: boolean;
  notes?: NoteType[];
  addNote: MouseEventHandler;
  deleteNote: (params: DeleteNoteMutationParams) => void;
  updateNote: UpdateNoteFn;
};

const NotesList: React.FC<NoteListProps> = ({
  addingNote,
  addNote,
  notes,
  updateNote,
  deleteNote,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  return (
    <>
      <section className={styles.notes_list}>
        {notes?.map((note) => {
          return (
            <Note
              key={note.id}
              active={note.active ?? false}
              title={note.noteTitle}
              content={note.noteContent}
              fsId={note.id}
              color={note.colorIndex ?? 0}
              setSelectedId={setSelectedId}
              updateNote={updateNote}
              deleteNote={deleteNote}
            />
          );
        })}

        <button
          disabled={addingNote}
          onClick={addNote}
          className={styles.add_button}
        >
          {addingNote ? (
            <Oval
              height={30}
              width={30}
              color="white"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
              ariaLabel="oval-loading"
              secondaryColor="gray"
              strokeWidth={2}
              strokeWidthSecondary={2}
            />
          ) : (
            <IoAddOutline size={25} color="white" />
          )}
        </button>
      </section>
      {/* {selectedId && (
        <div
          id="overlay"
          style={{
            width: "100%",
            height: window.outerHeight,
            background: "#00000096",
            opacity: "0.7",
            position: "fixed",
            top: "0",
          }}
        ></div>
      )} */}
    </>
  );
};

export default NotesList;

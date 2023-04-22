import React, { MouseEventHandler, useEffect, useState } from "react";
import Note from "./Note";
import "../../../styles/home/noteslist.scss";
import { IoAddOutline } from "react-icons/io5";
import { toast } from "react-hot-toast";
import { Oval } from "react-loader-spinner";
import useAddNote from "../../../hooks/useAddNote";
import useGetNotes from "../../../hooks/useGetNotes";
import { useAuthUser } from "../../../hooks/useAuthUser";
import { AnimatePresence, motion } from "framer-motion";
import { Note as NoteType } from "@/types/Note";

type NoteListProps = {
  addingNote: boolean;
  notes?: NoteType[];
  addNote: MouseEventHandler;
  deleteNote: Function;
  updateNote: Function;
};

const NotesList = ({
  addingNote,
  addNote,
  notes,
  updateNote,
  deleteNote,
}: NoteListProps) => {
  const [selectedId, setSelectedId] = useState(null);

  return (
    <>
      <section className="notes-list">
        {/* #TODO: add some loading state while fetching notes */}
        {notes?.map((note) => {
          return (
            <Note
              key={note.id}
              active={note.active ?? false}
              title={note.noteTitle}
              content={note.noteContent}
              fsId={note.id!}
              color={note.colorIndex!}
              // setSelectedId={setSelectedId}
              updateNote={updateNote}
              deleteNote={deleteNote}
            />
          );
        })}
        <AnimatePresence>
          {selectedId && <motion.div layoutId={selectedId}></motion.div>}
        </AnimatePresence>
        <button disabled={addingNote} onClick={addNote} className="add-button">
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
    </>
  );
};

export default NotesList;

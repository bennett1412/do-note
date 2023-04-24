import React, { MouseEventHandler, useEffect, useState, useRef } from "react";
import Note from "./Note";
import styles from "@/styles/home/noteslist.module.scss";
import { IoAddOutline } from "react-icons/io5";
import { toast } from "react-hot-toast";
import { Oval } from "react-loader-spinner";
import useAddNote from "@/hooks/useAddNote";
import useGetNotes from "@/hooks/useGetNotes";
import { useAuthUser } from "@/hooks/useAuthUser";
import { AnimatePresence, motion } from "framer-motion";
import { Note as NoteType } from "@/types/Note";
import Navbar from "@/components/Common/Navbar";

type NoteListProps = {
  addingNote: boolean;
  notes?: NoteType[];
  addNote: MouseEventHandler;
  deleteNote: Function;
  updateNote: Function;
};

const NotesList: React.FC<NoteListProps> = ({
  addingNote,
  addNote,
  notes,
  updateNote,
  deleteNote,
}) => {
  const [selectedId, setSelectedId] = useState(null);
  return (
    <>
      <Navbar />
      <section className={styles.notes_list}>
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
              setSelectedId={setSelectedId}
              updateNote={updateNote}
              deleteNote={deleteNote}
            />
          );
        })}
        <AnimatePresence>
          {selectedId && <motion.div layoutId={selectedId}></motion.div>}
        </AnimatePresence>
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
    </>
  );
};

export default NotesList;

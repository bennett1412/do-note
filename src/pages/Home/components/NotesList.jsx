import React, { useEffect, useState } from "react";
import Note from "./Note";
import "../../../styles/home/noteslist.scss";
import { IoAddOutline } from "react-icons/io5";

import { toast } from "react-hot-toast";
import { Oval } from "react-loader-spinner";
import useAddNote from "../../../hooks/useAddNote";
import useGetNotes from "../../../hooks/useGetNotes";
import { useAuthUser } from "../../../hooks/useAuthUser";
import { AnimatePresence, motion } from "framer-motion";

const NotesList = () => {
  const [selectedId, setSelectedId] = useState(null);
  const { user } = useAuthUser();
  const { data: notes } = useGetNotes(user.data.uid);
  const { mutate, isLoading: addingNote } = useAddNote({
    creatorId: user.data.uid,
    successCb: () => {},
    errorCb: () => {
      toast.error("Something went wrong please try later", {
        id: "note-creation-error",
      });
    },
  });

  const handleAdd = async () => {
    const newNote = {
      noteTitle: "",
      noteContent: JSON.stringify({
        type: "doc",
        content: [
          {
            type: "paragraph",
          },
        ],
      }),
    };
    mutate({ newNote: newNote, creatorId: user.data.uid });
  };

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
              fsId={note.id}
              color={note.color}
              setSelectedId={setSelectedId}
            />
          );
        })}
        <AnimatePresence>
          {selectedId && <motion.div layoutId={selectedId}></motion.div>}
        </AnimatePresence>
        <button
          disabled={addingNote}
          onClick={handleAdd}
          className="add-button"
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

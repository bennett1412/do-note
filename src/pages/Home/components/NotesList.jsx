import React, { useState } from "react";
import Note from "./Note";
import "../../../styles/home/noteslist.scss";
import { IoAddOutline } from "react-icons/io5";

import { toast } from "react-hot-toast";
import { Oval } from "react-loader-spinner";
import useAddNote from "../../../hooks/useAddNote";
import useGetNotes from "../../../hooks/useGetNotes";
import { useAuthUser } from "../../../hooks/useAuthUser";

const NotesList = () => {
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
    console.log(user.data.uid);
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
            />
          );
        })}{" "}
        */}
        {notes?.map((note) => (
          <>
            {(!selectedNote || selectedNote.id != note.id) && (
              <motion.div
                layoutId={note.id}
                onClick={() => setSelectedNote(note)}
              >
                <Note
                  key={note.id}
                  active={note.active ?? false}
                  title={note.noteTitle}
                  content={note.noteContent}
                  fsId={note.id}
                  color={note.color}
                />
              </motion.div>
            )}
          </>
        ))}
        <AnimatePresence>
          {selectedNote && (
            <motion.div
              layoutId={selectedNote}
              animate={{
                zIndex: 1040,
                width: "50vw",
                height: "70vh",
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                overflowY: "auto",
                WebkitBoxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.75)",
                MozBoxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.75)",
                boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.75)",
              }}
            >
              <Note
                key={selectedNote.id}
                active={selectedNote.active ?? false}
                title={selectedNote.noteTitle}
                content={selectedNote.noteContent}
                fsId={selectedNote.id}
                color={selectedNote.color}
              />
            </motion.div>
          )}
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

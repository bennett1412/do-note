import React from "react";
import Note from "./Note";
import "../../../styles/home/noteslist.scss";
import { IoAddOutline } from "react-icons/io5";

import { toast } from "react-hot-toast";
import { Oval } from "react-loader-spinner";
import useAddNote from "../../../hooks/useAddNote";
import useGetNotes from "../../../hooks/useGetNotes";

const NotesList = () => {
  const { data: notes } = useGetNotes();

  const { mutate, isLoading: addingNote } = useAddNote({
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
    mutate(newNote);
  };

  return (
    <>
      <section className="notes-list">
        {/* #TODO: add some loading state while fetching notes */}
        {notes?.map((note) => {
          console.log(note.noteTitle);
          return (
            <Note
              key={note.id}
              active={note.active ?? false}
              title={note.noteTitle}
              content={note.noteContent}
              fsId={note.id}
            />
          );
        })}
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

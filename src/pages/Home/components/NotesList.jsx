import { useRef, useEffect, useState } from "react";
import Note from "./Note";
import "../../../styles/home/noteslist.scss";
import { IoAddOutline } from "react-icons/io5";
import { notes } from "../../../notes";
import NewNote from "./NewNote";
const NotesList = () => {
  const [notelist, setNotelist] = useState(notes);
  const handleAdd = () => {
    console.log("adding");
    setNotelist([
      ...notelist,
      {
        noteTitle: "",
        noteContent: {
          type: "doc",
          content: [
            {
              type: "paragraph",
            },
          ],
        },
        active: true,
      },
    ]);
  };

  return (
    <>
      <NewNote />
      <section className="notes-list">
        {notelist.map((note, i) => {
          return (
            <Note
              key={i}
              active={note.active ?? false}
              title={note.noteTitle}
              content={note.noteContent}
            />
          );
        })}
        <button onClick={handleAdd} className="add-button">
          <IoAddOutline size={25} color="white" />
        </button>
      </section>
    </>
  );
};

export default NotesList;

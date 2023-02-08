import { useRef, useEffect, useState } from "react";
import Note from "./Note";
import "../../../styles/home/noteslist.scss";
import { IoAddOutline } from "react-icons/io5";
import { notes } from "../../../notes";
import NewNote from "./NewNote";
import { addNote, getNotes } from "../../../utils/firebase/firestore";
const NotesList = () => {
  const [notelist, setNotelist] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await getNotes();
      setNotelist(res);
    };
    fetch();
  }, []);

  const handleAdd = async () => {
    console.log("adding");
    const newNote = {
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
    };
    setNotelist([...notelist, newNote]);
    const res = await addNote(newNote);
  };

  return (
    <>
      <NewNote />
      <section className="notes-list">
        {notelist.map((note, i) => {
          console.log(note);
          return (
            <Note
              key={i}
              active={note.active ?? false}
              title={note.noteTitle}
              content={note.noteContent}
              fsId={note.id}
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

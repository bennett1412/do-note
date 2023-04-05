import React, { useEffect, useState } from "react";
// import "../../../styles/home/noteslist.scss";
import { IoAddOutline } from "react-icons/io5";
import NotesList from "../Home/components/NotesList";
import useIndexedDB from "../../hooks/useIndexedDB";

const OfflineNotes = () => {
  const [notes, setNotes] = useState([]);
  let db = useIndexedDB();

  const addOfflineNote = async () => {
    const newNote = {
      id: new Date().getTime(),
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
    setNotes([...notes, newNote]);
    const res = await db.add("notes", newNote);
    console.log(res);
  };
  const updateNote = async (noteId, updatedNote) => {
    const tx = db.transaction("notes", "readwrite");
    const store = tx.objectStore("notes");
    const entry = await store.get(noteId);
    if (entry) {
      Object.assign(entry, updatedNote);
    } else {
      // note missing -> show error
    }
    await tx.done;
  };

  return (
    <section>
      <NotesList
        addNote={addOfflineNote}
        notes={notes}
        updateNote={updateNote}
      />
    </section>
  );
};

export default OfflineNotes;

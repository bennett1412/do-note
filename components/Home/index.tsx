import React, { useContext } from "react";
import NotesList from "./components/NotesList";
import { toast } from "react-hot-toast";

import useAddNote from "@/hooks/useAddNote";
import useGetNotes from "@/hooks/useGetNotes";
import { updateNote } from "@/utils/firebase/firestore";
import { NoteContent } from "@/types/Note";
import useDeleteNote from "@/hooks/useDeleteNote";
import { useUser } from "next-firebase-auth";
// import NotesLoader from "@/components/Common/NotesLoader";
import Navbar from "../Common/Navbar";
import { DotsLoader } from "../Common/Loader";
import Head from "next/head";
import { useSession } from "@/hooks/useSession";

const Home: React.FC = () => {
  const user = useSession;
  const { data: notes, isLoading } = useGetNotes(user.id);
  const { mutate: addMutate, isLoading: addingNote } = useAddNote({
    creatorId: user.id,
    errorCb: () => {
      toast.error("Something went wrong please try later", {
        id: "note-creation-error",
      });
    },
  });
  const { mutate: deleteMutate } = useDeleteNote({
    creatorId: user.id,
    errorCb: () => {
      toast.error("Deletion failed, pls try later", {
        id: "delete-error",
      });
    },
  });

  const handleAdd = async () => {
    const newNote: NoteContent = {
      noteTitle: "",
      noteContent: JSON.stringify({
        type: "doc",
        content: [
          {
            type: "paragraph",
          },
        ],
      }),
      color: "var(--note-bg-dark-4)"
    };
    addMutate({
      newNote: newNote,
      creatorId: user.id,
    });
  };

  return (
    <>
      <Head>
        <title>Notes</title>
      </Head>
      <Navbar />
      {isLoading ? (
        <DotsLoader />
      ) : (

        <NotesList
          addNote={handleAdd}
          updateNote={updateNote}
          deleteNote={deleteMutate}
          addingNote={addingNote}
          notes={notes}
        />
      )}
    </>
  );
};

export default Home;

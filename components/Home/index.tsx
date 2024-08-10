import React, {  } from "react";
import NotesList from "./components/NotesList";
import { toast } from "react-hot-toast";

import useAddNote from "@/hooks/useAddNote";
import useGetNotes from "@/hooks/useGetNotes";
import { updateNote } from "@/utils/supabase/db_operations";
import { NoteContent } from "@/types/Note";
import useDeleteNote from "@/hooks/useDeleteNote";
// import NotesLoader from "@/components/Common/NotesLoader";
import Navbar from "../Common/Navbar";
import { DotsLoader } from "../Common/Loader";
import Head from "next/head";
import { useSession } from "@/hooks/useSession";

const Home: React.FC = () => {
  const { user } = useSession();
  const userId = user.id ?? null;

  const { data: notes, isLoading } = useGetNotes(userId);
  const { mutate: addMutate, isLoading: addingNote } = useAddNote({
    creatorId: userId,
    errorCb: () => {
      toast.error("Something went wrong please try later", {
        id: "note-creation-error",
      });
    },
  });
  const { mutate: deleteMutate } = useDeleteNote({
    creatorId: userId,
    errorCb: () => {
      toast.error("Deletion failed, pls try later", {
        id: "delete-error",
      });
    },
  });

  const handleAdd = async () => {
    const newNote: NoteContent = {
      note_title: "",
      note_content: JSON.stringify({
        type: "doc",
        content: [
          {
            type: "paragraph",
          },
        ],
      }),
      color: "var(--note-bg-dark-4)",
    };
    // return;
    addMutate({
      newNote: newNote,
      creatorId: userId,
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

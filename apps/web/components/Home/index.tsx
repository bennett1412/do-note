import React from "react";
import NotesList from "./components/NotesList";
import { toast } from "react-hot-toast";

import useAddNote from "@/hooks/useAddNote";
import useGetNotes from "@/hooks/useGetNotes";
import { updateNote } from "@/utils/supabase/db_operations";
import type { NoteCreate } from "@/types/Note";
import useDeleteNote from "@/hooks/useDeleteNote";
import { DotsLoader } from "../Common/Loader";
import Head from "next/head";

const Home: React.FC = () => {
  const { data: notes, isLoading } = useGetNotes();
  const { mutate: addMutate, isLoading: addingNote } = useAddNote({
    errorCb: () => {
      toast.error("Something went wrong please try later", {
        id: "note-creation-error",
      });
    },
  });
  const { mutate: deleteMutate } = useDeleteNote({
    errorCb: () => {
      toast.error("Deletion failed, pls try later", {
        id: "delete-error",
      });
    },
  });

  const handleAdd = async () => {
    const newNote: NoteCreate = {
      noteTitle: "",
      noteContent: JSON.stringify({
        type: "doc",
        content: [
          {
            type: "paragraph",
          },
        ],
      }),
      color: "var(--note-bg-dark-4)",
    };
    addMutate(newNote);
  };

  return (
    <>
      <Head>
        <title>Notes</title>
      </Head>
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

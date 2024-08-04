import React, { useContext, useEffect } from "react";
import NotesList from "./components/NotesList";
import { toast } from "react-hot-toast";

import useAddNote from "@/hooks/useAddNote";
import useGetNotes from "@/hooks/useGetNotes";
// import { updateNote } from "@/utils/firebase/firestore";
import { updateNote } from "@/utils/supabase/db_operations";
import { NoteContent } from "@/types/Note";
import useDeleteNote from "@/hooks/useDeleteNote";
import { useUser } from "next-firebase-auth";
// import NotesLoader from "@/components/Common/NotesLoader";
import Navbar from "../Common/Navbar";
import { DotsLoader } from "../Common/Loader";
import Head from "next/head";
import { useSession } from "@/hooks/useSession";
import { supabase } from "@/utils/supabase/init";

const Home: React.FC = () => {
  const { user, status } = useSession();
  const userId = user.id ?? null;
  // useEffect(() => {
  //   const getNotes = async () => {
  //     console.log('userID:',user, status)
  //     try{
  //     const { data: notes, error } = await supabase
  //     .from('notes')
  //     .select('*')
  //     .eq('creator', userId)
  //     .order('timestamp', { ascending: false });
  //     console.log(notes, error)
  //     }catch(error){
  //       console.log(error)
  //     }
  //   }
  //   getNotes()

  // }, [])

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
    console.log(userId);
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

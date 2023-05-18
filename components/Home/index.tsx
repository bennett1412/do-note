import React, { useEffect } from "react";
import NotesList from "./components/NotesList";
import { toast } from "react-hot-toast";

import useAddNote from "@/hooks/useAddNote";
import useGetNotes from "@/hooks/useGetNotes";
import { updateNote } from "@/utils/firebase/firestore";
import { NoteContent } from "@/types/Note";
import useDeleteNote from "@/hooks/useDeleteNote";
import { useAuthUser, verifyIdToken } from "next-firebase-auth";
// import NotesLoader from "@/components/Common/NotesLoader";
import Navbar from "../Common/Navbar";
import { DotsLoader } from "../Common/Loader";
import { addToken } from "@/api-integ";

const Home: React.FC = () => {
  const user = useAuthUser();
  useEffect(() => {
    const updateAxios = async () => {
      try {
        const token = await user.getIdToken();
        if (token) addToken(token);
        else console.log("Token missing");
      } catch (error) {
        console.log(error);
      }
    };
    updateAxios();
  }, []);
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
  // prop
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
    };
    addMutate({
      newNote: newNote,
      creatorId: user.id,
    });
  };

  return (
    <>
      <Navbar />
      {isLoading ? (
        <DotsLoader />
      ) : (
        // <NotesLoader/>
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

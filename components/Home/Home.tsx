import React from "react";
import dynamic from "next/dynamic";
import NotesList from "./components/NotesList";
import { toast } from "react-hot-toast";
import { Oval } from "react-loader-spinner";

import useAddNote from "@/hooks/useAddNote";
import useGetNotes from "@/hooks/useGetNotes";
import { updateNote } from "@/utils/firebase/firestore";
// import { useAuthUser } from "@/hooks/useAuthUser";
import { Note } from "@/types/Note";
import useDeleteNote from "@/hooks/useDeleteNote";
import { AuthStateType } from "@/types/Auth";
import { AuthUser } from "next-firebase-auth";

const Home = ({ user }: { user: AuthUser }) => {
  const { data: notes } = useGetNotes(user.id!);
  const { mutate: addMutate, isLoading: addingNote } = useAddNote({
    creatorId: user.id!,
    successCb: () => {},
    errorCb: () => {
      toast.error("Something went wrong please try later", {
        id: "note-creation-error",
      });
    },
  });
  const { mutate: deleteMutate, isLoading: isDeleting } = useDeleteNote({
    creatorId: user.id!,
    successCb: () => {
      // setEditMode(false);
    },
    errorCb: () => {
      toast.error("Deletion failed, pls try later", {
        id: "delete-error",
      });
    },
  });
  // prop
  const handleAdd = async () => {
    const newNote: Note = {
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
    addMutate({ newNote: newNote, creatorId: user.id! });
  };
  return (
    <>
      {/* <Tagbar /> */}
      <NotesList
        addNote={handleAdd}
        updateNote={updateNote}
        deleteNote={deleteMutate}
        addingNote={addingNote}
        notes={notes}
      />
    </>
  );
};

export default Home;

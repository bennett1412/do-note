import React from "react";
import NotesList from "./components/NotesList";
import { toast } from "react-hot-toast";

import useAddNote from "@/hooks/useAddNote";
import useGetNotes from "@/hooks/useGetNotes";
import { updateNote } from "@/utils/firebase/firestore";
import { Note } from "@/types/Note";
import useDeleteNote from "@/hooks/useDeleteNote";
import { useAuthUser } from "next-firebase-auth";

const Home: React.FC = () => {
  const user = useAuthUser();
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

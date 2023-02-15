import React, { useRef, useEffect, useState } from "react";
import Note from "./Note";
import "../../../styles/home/noteslist.scss";
import { IoAddOutline } from "react-icons/io5";
import { notes } from "../../../notes";
import NewNote from "./NewNote";
import { addNote, getNotes } from "../../../utils/firebase/firestore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { Oval } from "react-loader-spinner";

const NotesList = () => {
  const queryClient = useQueryClient();
  const notesQuery = useQuery({
    queryKey: ["notes"],
    queryFn: () => {
      console.log("fetching notes");
      return getNotes();
    },
  });
  const mutation = useMutation({
    mutationFn: addNote,
    onSuccess: (data, variables) => {
      // Invalidate and refetch
      console.log("sucess cb", data, "vars:", variables);
      queryClient.setQueryData(["notes"], (oldNotes) => [
        ...oldNotes,
        { ...variables, id: data.id, active: true },
      ]);
    },
    onError: () => {
      toast.error("Something went wrong please try later");
    },
  });
  const handleAdd = async () => {
    const newNote = {
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
    // const res = await addNote(newNote);
    const res = mutation.mutate(newNote);
    console.log("mutation result", res);

    // setNotelist([...notelist, { active: true, fsId: res.id, ...newNote }]);
  };

  return (
    <>
      <section className="notes-list">
        {notesQuery.data?.map((note, i) => {
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
        <button
          disabled={mutation.isLoading}
          onClick={handleAdd}
          className="add-button"
        >
          {mutation.isLoading ? (
            <Oval
              height={30}
              width={30}
              color="white"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
              ariaLabel="oval-loading"
              secondaryColor="gray"
              strokeWidth={2}
              strokeWidthSecondary={2}
            />
          ) : (
            <IoAddOutline size={25} color="white" />
          )}
        </button>
      </section>
    </>
  );
};

export default NotesList;

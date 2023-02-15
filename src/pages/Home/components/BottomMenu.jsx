import React from "react";
import "../../../styles/home/bottommenu.scss";
import { IoIosColorPalette } from "react-icons/io";
import { FiEdit3 } from "react-icons/fi";
import { TbPinned } from "react-icons/tb";
import clsx from "clsx";
import { MdOutlineDelete } from "react-icons/md";
import { deleteNote } from "../../../utils/firebase/firestore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const BottomMenu = ({ setEditMode, active, fsId }) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: (data, deletedNoteId) => {
      queryClient.setQueryData(["notes"], (oldNotes) => {
        console.log(data, deletedNoteId);
        const newNotes = oldNotes.filter((note) => {
          console.log(note.id, deletedNoteId);
          return note.id != deletedNoteId;
        });
        return newNotes;
      });
    },
  });
  const handleDelete = async () => {
    const confirm = window.confirm(
      "Are you sure you want to delete this note?"
    );
    if (confirm) {
      await deleteMutation.mutate(fsId);
    }
  };
  return (
    <div className="toolbar">
      <button className="toolbar-button">
        <IoIosColorPalette color="white" />
      </button>
      <button onClick={setEditMode} className="toolbar-button">
        <FiEdit3 />
      </button>
      <button className="toolbar-button">
        <TbPinned />
      </button>
      {active && (
        <>
          <button onClick={handleDelete} className="toolbar-button">
            <MdOutlineDelete />
          </button>
        </>
      )}
    </div>
  );
};

export default BottomMenu;

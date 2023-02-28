import React from "react";
import "../../../styles/home/bottommenu.scss";
import { IoIosColorPalette } from "react-icons/io";
import { FiEdit3 } from "react-icons/fi";
import { TbPinned } from "react-icons/tb";
import clsx from "clsx";
import { MdOutlineDelete } from "react-icons/md";
import { deleteNote } from "../../../utils/firebase/firestore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import useDeleteNote from "../../../hooks/useDeleteNote";
import ColorMenu from "../../../components/Menu";

const BottomMenu = ({ setEditMode, active, fsId, setColor }) => {
  const { mutate } = useDeleteNote({
    sucessCb: () => {
      setEditMode(false);
    },
    errorCb: () => {
      toast.error("Deletion failed, pls try later", {
        id: "delete-error",
      });
    },
  });
  const handleDelete = async () => {
    const confirm = window.confirm(
      "Are you sure you want to delete this note?"
    );
    if (confirm) {
      mutate(fsId);
    }
  };
  return (
    <div className="toolbar">
      <ColorMenu setColor={setColor} />
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

import React from "react";
import "../../../styles/home/bottommenu.scss";
import { FiEdit3 } from "react-icons/fi";
import { TbPinned } from "react-icons/tb";
import { MdOutlineDelete } from "react-icons/md";
import { toast } from "react-hot-toast";
import useDeleteNote from "../../../hooks/useDeleteNote";
import ColorMenu from "../../../components/Menu";
import { useAuthUser } from "../../../hooks/useAuthUser";
import { clsx } from "clsx";

const BottomMenu = ({
  setEditMode,
  active,
  fsId,
  setColor,
  theme,
  deleteNote,
  isDeleting,
}) => {
  const handleDelete = async () => {
    const confirm = window.confirm(
      "Are you sure you want to delete this note?"
    );
    if (confirm) {
      deleteNote(fsId);
    }
  };
  return (
    <div className={clsx({ toolbar: true, dark_toolbar: theme === "dark" })}>
      <ColorMenu setColor={setColor} />
      <button onClick={setEditMode} className="toolbar-button">
        <FiEdit3 />
      </button>
      <button className="toolbar-button">
        <TbPinned />
      </button>
      {active && (
        <>
          <button
            disabled={isDeleting}
            onClick={handleDelete}
            className="toolbar-button"
          >
            <MdOutlineDelete />
          </button>
        </>
      )}
    </div>
  );
};

export default BottomMenu;

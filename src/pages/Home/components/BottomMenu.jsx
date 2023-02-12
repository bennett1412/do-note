import React from "react";
import "../../../styles/home/bottommenu.scss";
import { IoIosColorPalette } from "react-icons/io";
import { FiEdit3 } from "react-icons/fi";
import { TbPinned } from "react-icons/tb";
import clsx from "clsx";
import { MdOutlineDelete } from "react-icons/md";
import { deleteNote } from "../../../utils/firebase/firestore";

const BottomMenu = ({ setEditMode, active, fsId }) => {
  const handleDelete = async () => {
    const confirm = window.confirm(
      "Are you sure you want to delete this note?"
    );
    if (confirm) {
      await deleteNote(fsId);
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

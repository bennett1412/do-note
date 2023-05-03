import React, { MouseEventHandler } from "react";
import styles from "@/styles/home/note.module.scss";
import button from "@/styles/common/button.module.scss";
import { FiEdit3 } from "react-icons/fi";
import { TbPinned } from "react-icons/tb";
import { MdOutlineDelete } from "react-icons/md";
import { toast } from "react-hot-toast";
import useDeleteNote from "../../../hooks/useDeleteNote";
import ColorMenu from "@/components/Common/Menu";
import { useAuthUser } from "../../../hooks/useAuthUser";
import { clsx } from "clsx";

type BottomMenuProps = {
  setEditMode: (flag: boolean) => void;
  active: boolean;
  fsId: string;
  setColor: Function;
  theme: string;
  deleteNote: Function;
  isDeleting?: boolean;
};

const BottomMenu: React.FC<BottomMenuProps> = ({
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
    <div
      className={clsx(styles.toolbar, styles.dark_toolbar && theme == "dark")}
    >
      <ColorMenu setColor={setColor} />
      <button
        onClick={() => setEditMode(true)}
        className={button.toolbar_button}
      >
        <FiEdit3 />
      </button>
      <button className={button.toolbar_button}>
        <TbPinned />
      </button>
      {active && (
        <>
          <button
            disabled={isDeleting}
            onClick={handleDelete}
            className={button.toolbar_button}
          >
            <MdOutlineDelete />
          </button>
        </>
      )}
    </div>
  );
};

export default BottomMenu;

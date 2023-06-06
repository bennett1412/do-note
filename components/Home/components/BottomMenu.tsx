import React, { FC } from "react";
import styles from "@/styles/home/note.module.scss";
import button from "@/styles/common/button.module.scss";
import { FiEdit3 } from "react-icons/fi";
import { TbPinned } from "react-icons/tb";
import { BiCopy } from "react-icons/bi";
import { MdOutlineDelete } from "react-icons/md";
import ColorMenu from "@/components/Common/Menu";
import { clsx } from "clsx";
import { DeleteMutation } from "@/types/Note";
import Button from "@/components/Common/Button";

type BottomMenuProps = {
  setEditMode: (flag: boolean) => void;
  active: boolean;
  fsId: string;
  setColor: (colorIndex: number) => void;
  theme: string;
  deleteNote: DeleteMutation;
  isDeleting?: boolean;
};

const BottomMenu: FC<BottomMenuProps> = ({ setEditMode, active, fsId, setColor, theme, deleteNote, isDeleting }) => {
  const handleDelete = async () => {
    const confirm = window.confirm("Are you sure you want to delete this note?");
    if (confirm) {
      deleteNote(fsId);
    }
  };
  return (
    <div className={clsx(styles.toolbar, styles.dark_toolbar && theme == "dark")}>
      <ColorMenu setColor={setColor} />
      <Button onClick={() => setEditMode(true)} className={button.toolbar_button}>
        <FiEdit3 />
      </Button>
      <Button onClick={()=> console.log('clickedcopy')} className={button.toolbar_button}>
        <BiCopy />
      </Button>
      {active && (
        <>
          <Button disabled={isDeleting} onClick={handleDelete} className={button.toolbar_button}>
            <MdOutlineDelete />
          </Button>
        </>
      )}
    </div>
  );
};

export default BottomMenu;
